# Supported libraries and functions via object methods (Future releases)

data/ ├── text/ │ └── (tokenized words, sentences, documents) ├── image/ │ └──
(pixels, grayscale, RGB, etc.) ├── audio/ │ └── (waveform, spectrogram, MFCC)
├── video/ │ └── (frames + temporal dynamics) ├── time_series/ │ └── (stock
prices, sensors, EEG) ├── graph/ │ └── (nodes + edges) ├── multi_modal/ │ └──
(text+image, audio+video, etc.)

---

architecture/ ├── text/ │ ├── RNN │ ├── LSTM │ ├── GRU │ ├── Transformer │ └──
BERT, GPT, T5 ├── image/ │ ├── CNN │ ├── VisionTransformer (ViT) │ ├──
Autoencoder │ └── GAN, Diffusion ├── audio/ │ ├── 1D-CNN │ ├── RNN (speech) │
├── Transformer │ └── Wav2Vec ├── video/ │ ├── 3D-CNN │ ├── ConvLSTM │ └──
VideoTransformer ├── time_series/ │ ├── LSTM │ ├── TCN (Temporal ConvNet) │ └──
Transformer ├── graph/ │ └── GNN (GCN, GAT, GraphSAGE) ├── multi_modal/ │ ├──
CLIP (text+image) │ ├── AudioCLIP │ └── Perceiver IO

---

task/ ├── classification/ │ ├── image (CNN, ViT) │ ├── text (Transformer) │ ├──
audio (1D-CNN, RNN) │ └── graph (GNN) ├── regression/ │ ├── time_series (LSTM) │
├── text (sentiment score) │ └── audio (emotion intensity) ├── generation/ │ ├──
text → text (LLM) │ ├── text → code (Codex-like) │ ├── image → image (GAN,
diffusion) │ ├── audio → waveform (TTS) │ └── image ← text (text2image like
DALL·E) ├── summarization/ │ └── text → shorter text (Transformer) ├──
translation/ │ └── text → text (seq2seq) ├── segmentation/ │ └── image → pixel
map (UNet) ├── detection/ │ └── image → bounding boxes (YOLO, RCNN) ├──
clustering/ │ ├── text embeddings │ └── image features ├── reinforcement/ │ ├──
state → action (Q-learning, PPO) │ └── used in game AI, robotics ├── retrieval/
│ └── semantic search, RAG ├── reasoning/ │ └── CoT, Symbolic/NLP Hybrid

---

application/ ├── image_classifier → image + CNN ├── text_generator → text +
Transformer ├── chatbot → LLM + dialogue memory ├── object_detector → image +
YOLO ├── speech_to_text → audio + Transformer/RNN ├── text_to_speech → text +
WavNet/Tacotron ├── style_transfer → image + GAN ├── code_generator → text + LLM
├── time_series_forecaster → time_series + LSTM ├── recommender_system →
user/item + embeddings ├── agent → RL + policy network + environment ├──
autoencoder → any + AE + latent learning ├── multimodal_retrieval → CLIP +
cosine search ├── VQA (Visual Question Answering) → image + text + FusionNet

---

learn/ ├── supervised/ ├── unsupervised/ ├── self_supervised/ ├── reinforcement/
├── imitation/ ├── few_shot/ ├── zero_shot/ ├── active_learning/

---

advanced/ ├── memory/ → vector store, context buffer ├── reasoning/ → CoT, logic
rules, in-context learning ├── tool_use/ → agent invokes external API/tools ├──
reflection/ → model evaluates itself ├── evolution/ → genetic model selection,
neuroevolution ├── self_improving_loop/ → RLHF or looped training ├── society/ →
multi-agent systems

---
math/
├── trignometry/ → trig math functions
├── calculus/ → integrals, derivatives, limits
├── basic/ → basic fundamental functions
├── complex/ → complex numbers
├── algebra/ → algebriac objects, calculations, vectors, matricies tensors, etc
├── arithmatic/ → combinaorics, primes etc
---
