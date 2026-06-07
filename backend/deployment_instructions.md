# Modal.com ControlNet Renovation Pipeline Deployment Guide

This guide details the step-by-step process to deploy your **100% Free** serverless room renovation pipeline on **Modal.com**.

---

## Prerequisites

Before starting, ensure you have:
1. A GitHub account (required by Modal for authentication).
2. Python installed locally.

---

## Step 1: Create a Free Modal Account

1. Go to **[modal.com](https://modal.com/)** and click **Sign Up**.
2. Authenticate using your **GitHub account**.
3. Upon registration, Modal automatically grants you **$30 in free compute credits every month**!
   > [!NOTE]
   > The $30/month credit is extremely generous. Running our multi-ControlNet SDXL pipeline takes only ~8 seconds on an L4 GPU, costing roughly **$0.009 per image**. This covers **~3,300 free generations per month**!

---

## Step 2: Install and Authenticate Modal CLI

Open your terminal (PowerShell / Command Prompt) on your local machine and run:

1. **Install the Modal CLI package:**
   ```powershell
   pip install modal
   ```

2. **Authenticate your CLI session:**
   ```powershell
   modal setup
   ```
   * This command will automatically open a web browser tab asking you to log into your Modal account.
   * Confirm the authentication. Once done, your local machine will be securely connected to your Modal account!

---

## Step 3: Deploy the Serverless Endpoint

From your backend root directory `c:\Users\HP 745 G6\Desktop\AI\backend`, deploy the serverless runner directly to the cloud:

```powershell
modal deploy modal_controlnet_pipeline.py
```

### What happens under the hood during deployment:
- Modal uploads `modal_controlnet_pipeline.py` to its cloud environment.
- It dynamically builds a high-performance Debian container with PyTorch, CUDA, Diffusers, and OpenCV.
- It creates a persistent **Volume** named `model-cache` so that the model checkpoints (RealVisXL, Depth, Canny) are downloaded only once and kept warm, guaranteeing near-zero cold start times!
- Once completed, the command line will output a secure HTTPS endpoint:
  ```
  ✓ Created web endpoint: https://<your-username>--room-renovation-controlnet-renovate.modal.run
  ```

---

## Step 4: Hook FastAPI Backend to the New Endpoint

1. Open your local backend environment configuration file [backend/.env](file:///c:/Users/HP%20745%20G6/Desktop/AI/backend/.env).
2. Add the secure HTTPS URL provided by the deployment command:
   ```env
   MODAL_ENDPOINT_URL="https://<your-username>--room-renovation-controlnet-renovate.modal.run"
   MODAL_ACTIVE=True
   ```
3. Restart your FastAPI backend server:
   ```powershell
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

Now, every room renovation request will hit your **free, lightning-fast Modal ControlNet pipeline**! Replicate will act as a secondary backup, and Pollinations will remain as the final emergency fallback.
