import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'

const PIPELINE_ID = "pip_qpUgXycjWF6YMeSL";

function Home() {
  const [currentStreamId, setCurrentStreamId] = useState(null);
  const [currentPlaybackId, setCurrentPlaybackId] = useState(null);
  const [currentWhipUrl, setCurrentWhipUrl] = useState(null);
  const [setupStatus, setSetupStatus] = useState({ type: 'dim', message: 'Stream not created yet' });
  const [paramsStatus, setParamsStatus] = useState({ type: 'dim', message: 'No parameters sent yet.' });
  const [videoStatus, setVideoStatus] = useState({ type: 'dim', message: 'Webcam not started' });
  
  const createStreamBtnRef = useRef(null);
  const resetBtnRef = useRef(null);
  const streamIdDisplayRef = useRef(null);
  const playbackIdDisplayRef = useRef(null);
  const promptElRef = useRef(null);
  const negativeElRef = useRef(null);
  const stepsElRef = useRef(null);
  const seedElRef = useRef(null);
  const openposeScaleElRef = useRef(null);
  const hedScaleElRef = useRef(null);
  const applyParamsBtnRef = useRef(null);
  const paramsHintRef = useRef(null);
  const startWebcamBtnRef = useRef(null);
  const localVideoRef = useRef(null);
  const outputIframeRef = useRef(null);
  
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window === 'undefined') return;

    // Initialize defaults
    if (promptElRef.current) promptElRef.current.value = "superman made of neon particles flying over a futuristic city, cinematic lighting";
    if (negativeElRef.current) negativeElRef.current.value = "blurry, low quality, flat, 2d";
    if (stepsElRef.current) stepsElRef.current.value = 40;
    if (seedElRef.current) seedElRef.current.value = 42;
    if (openposeScaleElRef.current) openposeScaleElRef.current.value = 0.25;
    if (hedScaleElRef.current) hedScaleElRef.current.value = 0.2;

    // Parameter presets
    const chips = document.querySelectorAll(".chip[data-preset]");
    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        const type = chip.getAttribute("data-preset");
        if (promptElRef.current) {
          if (type === "dreamy") {
            promptElRef.current.value = "dreamy watercolor forest, glowing bioluminescent mushrooms, soft volumetric fog, cinematic lighting";
          } else if (type === "comic") {
            promptElRef.current.value = "gritty comic book style, bold ink lines, high contrast shadows, halftone texture, dynamic action pose";
          } else if (type === "vaporwave") {
            promptElRef.current.value = "vaporwave city at night, neon grid, palm trees, pastel gradients, VHS artifacts, retrofuturistic";
          }
        }
      });
    });

    // Create Stream handler
    if (createStreamBtnRef.current) {
      createStreamBtnRef.current.addEventListener("click", async () => {
        if (createStreamBtnRef.current) createStreamBtnRef.current.disabled = true;
        setSetupStatus({ type: 'dim', message: 'Creating stream…' });

        try {
          const res = await fetch('/api/streams', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pipeline_id: PIPELINE_ID }),
          });

          let data;
          try {
            data = await res.json();
          } catch (e) {
            const text = await res.text();
            console.error("Failed to parse response:", text);
            setSetupStatus({ type: 'err', message: 'Invalid response from server. Check server logs.' });
            throw new Error("Failed to parse response");
          }

          if (!res.ok) {
            console.error("Create stream error:", data);
            if (res.status === 401) {
              setSetupStatus({ type: 'err', message: 'Invalid API key. Check your environment variables.' });
            } else if (res.status === 500 && data.message?.includes('not configured')) {
              setSetupStatus({ type: 'err', message: 'API key not configured on server. Check server logs.' });
            } else {
              setSetupStatus({ type: 'err', message: `Failed to create stream: ${data.error || data.message || 'Unknown error'}` });
            }
            throw new Error("HTTP " + res.status);
          }

          setCurrentStreamId(data.id);
          setCurrentPlaybackId(data.output_playback_id);
          setCurrentWhipUrl(data.whip_url);

          if (streamIdDisplayRef.current) streamIdDisplayRef.current.textContent = data.id || "—";
          if (playbackIdDisplayRef.current) playbackIdDisplayRef.current.textContent = data.output_playback_id || "—";

          if (data.output_playback_id && outputIframeRef.current) {
            outputIframeRef.current.src = `https://lvpr.tv/?v=${encodeURIComponent(data.output_playback_id)}&lowLatency=force&autoplay=1&muted=1`;
          }

          setSetupStatus({ type: 'ok', message: 'Stream created successfully' });
          if (paramsHintRef.current) paramsHintRef.current.textContent = "You can now tweak parameters & apply them 🎨";
          setParamsStatus({ type: 'dim', message: 'No parameters sent yet.' });

        } catch (err) {
          console.error(err);
          setSetupStatus({ type: 'err', message: 'Failed to create stream. Check API key & network.' });
        } finally {
          if (createStreamBtnRef.current) createStreamBtnRef.current.disabled = false;
        }
      });
    }

    // Reset handler
    if (resetBtnRef.current) {
      resetBtnRef.current.addEventListener("click", () => {
        setCurrentStreamId(null);
        setCurrentPlaybackId(null);
        setCurrentWhipUrl(null);
        if (streamIdDisplayRef.current) streamIdDisplayRef.current.textContent = "—";
        if (playbackIdDisplayRef.current) playbackIdDisplayRef.current.textContent = "—";
        if (outputIframeRef.current) outputIframeRef.current.src = "";
        if (pcRef.current) {
          pcRef.current.close();
          pcRef.current = null;
        }
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach(t => t.stop());
          localStreamRef.current = null;
        }
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = null;
        }
        setSetupStatus({ type: 'dim', message: 'Stream not created yet' });
        setParamsStatus({ type: 'dim', message: 'No parameters sent yet.' });
        setVideoStatus({ type: 'dim', message: 'Webcam not started' });
        if (paramsHintRef.current) paramsHintRef.current.textContent = "Stream must be created first.";
      });
    }

    // Apply Parameters handler
    if (applyParamsBtnRef.current) {
      applyParamsBtnRef.current.addEventListener("click", async () => {
        if (!currentStreamId) {
          setParamsStatus({ type: 'err', message: 'Create a Stream first.' });
          return;
        }

        const prompt = promptElRef.current?.value.trim() || "";
        const negative_prompt = negativeElRef.current?.value.trim() || "blurry, low quality, flat, 2d";

        let num_inference_steps = parseInt(stepsElRef.current?.value || "30", 10);
        if (!Number.isFinite(num_inference_steps) || num_inference_steps <= 0) num_inference_steps = 30;
        if (num_inference_steps > 60) num_inference_steps = 60;

        let seed = parseInt(seedElRef.current?.value || "42", 10);
        if (!Number.isFinite(seed) || seed < 0) seed = 42;

        const openposeScale = parseFloat(openposeScaleElRef.current?.value || "0");
        const hedScale = parseFloat(hedScaleElRef.current?.value || "0");

        setParamsStatus({ type: 'dim', message: 'Sending parameter update…' });
        if (applyParamsBtnRef.current) applyParamsBtnRef.current.disabled = true;

        const body = {
          model_id: "streamdiffusion",
          pipeline: "live-video-to-video",
          params: {
            model_id: "stabilityai/sd-turbo",
            prompt,
            prompt_interpolation_method: "slerp",
            normalize_prompt_weights: true,
            normalize_seed_weights: true,
            negative_prompt,
            num_inference_steps,
            seed,
            t_index_list: [0, 8, 17],
            controlnets: [
              {
                conditioning_scale: openposeScale,
                control_guidance_end: 1,
                control_guidance_start: 0,
                enabled: true,
                model_id: "thibaud/controlnet-sd21-openpose-diffusers",
                preprocessor: "pose_tensorrt",
                preprocessor_params: {}
              },
              {
                conditioning_scale: hedScale,
                control_guidance_end: 1,
                control_guidance_start: 0,
                enabled: true,
                model_id: "thibaud/controlnet-sd21-hed-diffusers",
                preprocessor: "soft_edge",
                preprocessor_params: {}
              },
              {
                conditioning_scale: 0,
                control_guidance_end: 1,
                control_guidance_start: 0,
                enabled: true,
                model_id: "thibaud/controlnet-sd21-canny-diffusers",
                preprocessor: "canny",
                preprocessor_params: { high_threshold: 200, low_threshold: 100 }
              },
              {
                conditioning_scale: 0,
                control_guidance_end: 1,
                control_guidance_start: 0,
                enabled: true,
                model_id: "thibaud/controlnet-sd21-depth-diffusers",
                preprocessor: "depth_tensorrt",
                preprocessor_params: {}
              },
              {
                conditioning_scale: 0,
                control_guidance_end: 1,
                control_guidance_start: 0,
                enabled: true,
                model_id: "thibaud/controlnet-sd21-color-diffusers",
                preprocessor: "passthrough",
                preprocessor_params: {}
              }
            ]
          }
        };

        try {
          const res = await fetch(`/api/streams/${encodeURIComponent(currentStreamId)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          let data;
          try {
            data = await res.json();
          } catch (e) {
            const text = await res.text();
            console.error("Failed to parse response:", text);
            setParamsStatus({ type: 'err', message: 'Invalid response from server.' });
            throw new Error("Failed to parse response");
          }

          if (!res.ok) {
            console.error("Param update error:", data);
            setParamsStatus({ type: 'err', message: `Failed to update parameters: ${data.error || data.message || 'Unknown error'}` });
            throw new Error("HTTP " + res.status);
          }

          setParamsStatus({ type: 'ok', message: 'Parameters updated ✨' });
        } catch (err) {
          console.error(err);
          setParamsStatus({ type: 'err', message: 'Failed to update parameters.' });
        } finally {
          if (applyParamsBtnRef.current) applyParamsBtnRef.current.disabled = false;
        }
      });
    }

    // Start Webcam handler
    if (startWebcamBtnRef.current) {
      startWebcamBtnRef.current.addEventListener("click", async () => {
        if (!currentWhipUrl) {
          setVideoStatus({ type: 'err', message: 'Create a Stream first so we get a WHIP URL.' });
          return;
        }

        try {
          setVideoStatus({ type: 'dim', message: 'Requesting webcam access…' });
          if (startWebcamBtnRef.current) startWebcamBtnRef.current.disabled = true;

          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          localStreamRef.current = stream;
          if (localVideoRef.current) localVideoRef.current.srcObject = stream;

          setVideoStatus({ type: 'dim', message: 'Creating WebRTC connection…' });

          const peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
          });
          pcRef.current = peerConnection;

          stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);

          setVideoStatus({ type: 'dim', message: 'Sending WHIP offer…' });
          const res = await fetch(currentWhipUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/sdp",
              "Accept": "application/sdp",
            },
            body: offer.sdp,
          });

          if (!res.ok) {
            const text = await res.text();
            console.error("WHIP error:", text);
            throw new Error("Failed WHIP negotiation. HTTP " + res.status);
          }

          const answerSdp = await res.text();
          const answer = new RTCSessionDescription({ type: "answer", sdp: answerSdp });
          await peerConnection.setRemoteDescription(answer);

          setVideoStatus({ type: 'ok', message: 'Live! Webcam streaming to StreamDiffusion 🔴' });
        } catch (err) {
          console.error(err);
          setVideoStatus({ type: 'err', message: 'Failed to start webcam or WHIP session.' });
          if (startWebcamBtnRef.current) startWebcamBtnRef.current.disabled = false;
        }
      });
    }
  }, [currentStreamId, currentWhipUrl]);

  return (
    <>
      <Head>
        <title>Daydream StreamDiffusion Playground</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="app">
        <h1>
          StreamDiffusion Playground
          <span className="badge">WebRTC • Livepeer</span>
        </h1>
        <div className="subtitle">
          ① Create a Stream → ② Go Live from your webcam → ③ Watch the AI-morphed output in the player 💫  
        </div>

        <div className="layout">
          <div className="card">
            <div className="card-inner">
              <div className="card-title">
                <span>1. API & Stream Setup</span>
                <span className="label">
                  <span className="pill">Pipeline: <strong>pip_qpUgXycjWF6YMeSL</strong></span>
                </span>
              </div>

              <div className="row">
                <div className="field-inline">
                  <div className="tiny" style={{padding: '8px', background: 'rgba(255, 106, 213, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 106, 213, 0.3)'}}>
                    🔒 <strong>Secure Mode:</strong> API key is stored server-side in environment variables. 
                    See <code className="inline">.env.local</code> file for configuration.
                  </div>
                </div>
              </div>

              <div className="row spread" style={{marginTop: '4px'}}>
                <button ref={createStreamBtnRef}>
                  <span>✨ Create Stream</span>
                </button>
                <button className="ghost" type="button" ref={resetBtnRef}>
                  Reset session
                </button>
              </div>

              <div className="status-bar">
                <span className={`status-pill ${setupStatus.type}`}>
                  <span className={`status-dot ${setupStatus.type === 'ok' ? 'live' : ''}`}></span> {setupStatus.message}
                </span>
              </div>

              <div className="tiny" style={{marginTop: '6px'}}>
                <strong>Stream ID:</strong> <span ref={streamIdDisplayRef}>—</span> ·
                <strong> Playback ID:</strong> <span ref={playbackIdDisplayRef}>—</span>
              </div>

              <hr style={{margin: '14px 0 12px', border: 'none', borderTop: '1px dashed #2c2c3a'}} />

              <div className="card-title">
                <span>2. StreamDiffusion Parameters</span>
                <span className="label">
                  <span className="pill">Model: stabilityai/sd-turbo</span>
                </span>
              </div>

              <div className="params-grid">
                <div>
                  <label htmlFor="prompt">Prompt</label>
                  <textarea id="prompt" ref={promptElRef} placeholder="A neon cyberpunk city with watercolor strokes"></textarea>
                  <div className="chips">
                    <span className="chip" data-preset="dreamy">dreamy watercolor forest, glowing mushrooms</span>
                    <span className="chip" data-preset="comic">gritty comic book style, bold ink lines</span>
                    <span className="chip" data-preset="vaporwave">vaporwave city, pastel gradients, nostalgic</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="negativePrompt">Negative Prompt</label>
                  <textarea id="negativePrompt" ref={negativeElRef} placeholder="blurry, low quality, flat, 2d"></textarea>
                </div>

                <div className="row">
                  <div className="field-inline">
                    <label htmlFor="steps">Num inference steps</label>
                    <input id="steps" ref={stepsElRef} type="number" min="1" max="60" />
                  </div>
                  <div className="field-inline">
                    <label htmlFor="seed">Seed</label>
                    <input id="seed" ref={seedElRef} type="number" min="0" />
                  </div>
                </div>

                <div className="row">
                  <div className="field-inline">
                    <label htmlFor="openposeScale">Pose Conditioning Scale</label>
                    <input id="openposeScale" ref={openposeScaleElRef} type="number" min="0" max="1" step="0.01" />
                    <div className="tiny">0 = off, ~0.2–0.4 = strong pose guidance</div>
                  </div>
                  <div className="field-inline">
                    <label htmlFor="hedScale">HED Edge Conditioning Scale</label>
                    <input id="hedScale" ref={hedScaleElRef} type="number" min="0" max="1" step="0.01" />
                    <div className="tiny">Preserve soft edges & silhouettes</div>
                  </div>
                </div>

                <div className="row spread" style={{marginTop: '2px'}}>
                  <button ref={applyParamsBtnRef} className="secondary">
                    🎨 Apply Parameters
                  </button>
                  <span className="tiny" ref={paramsHintRef}>Stream must be created first.</span>
                </div>

                <div className="status-bar">
                  {paramsStatus.message && (
                    <span className={`status-pill ${paramsStatus.type}`}>{paramsStatus.message}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-inner">
              <div className="card-title">
                <span>3. Live Video</span>
                <span className="label">
                  <span className="pill">Input: Webcam via WHIP</span>
                  <span className="pill">Output: Livepeer iframe (WebRTC)</span>
                </span>
              </div>

              <div className="row spread">
                <button ref={startWebcamBtnRef} className="secondary">
                  📹 Start webcam & go live
                </button>
                <span className="tiny">
                  We'll use your webcam stream as input and render the AI-processed version on the right.
                </span>
              </div>

              <div className="video-shell">
                <div>
                  <div className="pane-title">
                    <span>Local Preview</span>
                    <span className="tiny">Muted on purpose 🔇</span>
                  </div>
                  <video ref={localVideoRef} id="localVideo" autoPlay muted playsInline></video>
                </div>
                <div>
                  <div className="pane-title">
                    <span>AI Output Player</span>
                    <span className="tiny">Livepeer iframe · lowLatency=force</span>
                  </div>
                  <iframe
                    ref={outputIframeRef}
                    id="outputIframe"
                    title="Livepeer AI Output"
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                    referrerPolicy="origin"
                  ></iframe>
                </div>
              </div>

              <div className="status-bar" style={{marginTop: '10px'}}>
                <span className={`status-pill ${videoStatus.type}`}>
                  <span className={`status-dot ${videoStatus.type === 'ok' ? 'live' : ''}`}></span> {videoStatus.message}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-note">
          <span>
            Built with Next.js and deployed on Vercel. API key stored securely server-side.
          </span>
          <span>
            HLS is intentionally ignored here — this is a WebRTC-only party 🎉
          </span>
        </div>
      </div>
    </>
  );
}

// Disable SSR for this page since it uses client-side only features (WebRTC, DOM manipulation)
export default dynamic(() => Promise.resolve(Home), {
  ssr: false
});

