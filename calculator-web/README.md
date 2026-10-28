# Calculator Web App — Complete DevOps Implementation

**College Laboratory Assignment:** Agile Development Process and DevOps — Kubernetes Implemented Through Jenkins  
**Student Project Demonstration Guide**

---

## 1. Project Title
**Calculator Web App — End-to-End DevOps & Containerization Project**

---

## 2. Project Overview
This project delivers a fully functional, beginner-friendly **Calculator Web Application** packaged with modern DevOps tooling. It demonstrates containerization using Docker, orchestration and resource management using Kubernetes manifests on Docker Desktop, and automated CI/CD deployment using a Declarative Jenkins Pipeline on Windows 11.

---

## 3. Objectives
* Design and implement a responsive, robust, and accessible frontend calculator application.
* Containerize the static web application using NGINX and Docker.
* Create and validate Kubernetes resource manifests (Pods, Deployments, Services, ConfigMaps, PVCs, and Probes).
* Configure and execute an automated CI/CD pipeline in Jenkins on Windows.
* Support all 15 college laboratory exercises for Agile and DevOps assessment.

---

## 4. Features
* **Full Arithmetic Support:** Addition, subtraction, multiplication, division, percentages, and sign toggling.
* **Robust Input Validation:** Decimal precision handling, safe calculation without `eval()`, division-by-zero protection, and error state recovery.
* **Accessibility & UX:** Dark navy/charcoal styling, responsive grid layout, button active feedback, and full keyboard shortcut support.
* **DevOps Automation:** Dockerized NGINX web server, multi-object Kubernetes manifests, and a 10-stage Windows-compatible Jenkinsfile.

---

## 5. Technologies Used
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+).
* **Web Server:** NGINX (Alpine Linux container).
* **Containerization:** Docker & Docker Desktop.
* **Orchestration:** Kubernetes (Docker Desktop Kubernetes cluster).
* **CI/CD Automation:** Jenkins Declarative Pipeline.
* **Version Control:** Git & GitHub.

---

## 6. Architecture
```
[ Developer ] 
      │ (git push)
      ▼
[ GitHub Repository ] 
      │ (webhook / scm poll)
      ▼
[ Jenkins CI/CD on Windows ] ──(Builds Docker Image)──> [ Docker Hub ]
      │                                                       │
      ├─(Verify Tools & K8s Access)                           │ (pulls image)
      └─(kubectl apply) ──────────────────────────────────────▼
                          [ Docker Desktop Kubernetes Cluster ]
                                    │
                            (NodePort 30080)
                                    │
                                    ▼
                         [ User Browser / Faculty ]
```

---

## 7. Project Directory Structure
```
calculator-web/
├── index.html
├── style.css
├── script.js
├── Dockerfile
├── .dockerignore
├── .gitignore
├── README.md
├── k8s/
│   ├── pod.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── configmap.yaml
│   ├── pvc.yaml
│   ├── readiness-probe.yaml
│   └── namespace.yaml
└── Jenkinsfile
```

---

## 8. Prerequisites
Ensure the following tools are installed on your Windows 11 machine:
1. **Git for Windows** (`git --version`)
2. **Docker Desktop** with Kubernetes enabled (`docker --version`, `kubectl version --client`)
3. **Jenkins** running locally on port 3050 (`http://localhost:3050`) with Git, Docker, and Pipeline plugins installed.
4. **Valid Kubeconfig** available at `C:\jenkins-kube\config` for the Jenkins service account.

---

## 9. How the Calculator Works
* **Event-Driven Architecture:** Listens to button clicks and keyboard events.
* **Operand State Machine:** Manages `previousOperand`, `currentOperand`, and active `operation`.
* **Safe Calculation:** Executes direct arithmetic operations instead of string evaluation (`eval()`).
* **Floating-Point Precision:** Rounds results to 10 decimal places to eliminate floating-point arithmetic errors (e.g., `0.1 + 0.2 = 0.3`).
* **Error Recovery:** Catches division by zero, highlights the display in red, and clears automatically on the next digit entry.

---

## 10. Run Locally Without Docker
To test the web application directly in your browser without containers:
1. Open `calculator-web/index.html` in any web browser.
2. Alternatively, run a local static server using Python:
   ```cmd
   cd calculator-web
   python -m http.server 8080
   ```
3. Open `http://localhost:8080` in your browser.

---

## 11. Build and Run with Docker
1. **Build the Docker Image:**
   ```cmd
   docker build -t calculator-web:latest .
   ```
2. **Run the Container:**
   ```cmd
   docker run --rm -d --name calculator-web-container -p 8081:80 calculator-web:latest
   ```
3. **Access the App:** Open `http://localhost:8081` in your browser.
4. **Inspect Container:**
   ```cmd
   docker ps
   docker logs calculator-web-container
   ```
5. **Stop and Remove Container:**
   ```cmd
   docker stop calculator-web-container
   ```

---

## 12. Enable Kubernetes in Docker Desktop
1. Open Docker Desktop settings (`⚙`).
2. Navigate to **Kubernetes**.
3. Check **Enable Kubernetes**.
4. Click **Apply & Restart** and wait for the status indicator in the bottom-left corner to turn green (`Kubernetes is running`).

---

## 13. Verify Kubernetes Context
Open Command Prompt and verify your cluster connection:
```cmd
kubectl cluster-info
kubectl config current-context
```
*Expected output context:* `docker-desktop`

---

## 14. Create a Standalone Pod
To learn basic pod creation:
```cmd
kubectl apply -f k8s/pod.yaml
kubectl get pods
kubectl describe pod calculator-web-pod
kubectl delete -f k8s/pod.yaml
```
*(Note: Standalone pods are used for learning; Deployments are preferred for production availability).*

---

## 15. Deploy Using a Deployment
Deploy the application with automated scaling and self-healing:
```cmd
kubectl apply -f k8s/deployment.yaml
kubectl get deployments
kubectl get pods -l app=calculator-web
```

---

## 16. Expose the Application Using a Service
Expose the Deployment to your host machine via NodePort:
```cmd
kubectl apply -f k8s/service.yaml
kubectl get services
```
Access the application at: `http://localhost:30080`

---

## 17. Scale the Application
Scale the Deployment to 3 replicas:
```cmd
kubectl scale deployment/calculator-web --replicas=3
kubectl get pods -l app=calculator-web
```

---

## 18. Update the Docker Image
1. Build a new image tag:
   ```cmd
   docker build -t midhunesh/calculator-web:v2 .
   ```
2. Update the Deployment image:
   ```cmd
   kubectl set image deployment/calculator-web calculator-web=midhunesh/calculator-web:v2
   ```
3. Check rollout status:
   ```cmd
   kubectl rollout status deployment/calculator-web
   ```

---

## 19. Use a ConfigMap
Deploy configuration data separately from application code:
```cmd
kubectl apply -f k8s/configmap.yaml
kubectl get configmap calculator-config
kubectl describe configmap calculator-config
```

---

## 20. Create and Inspect a PVC
Demonstrate Kubernetes storage concepts (Note: static NGINX calculator does not require persistent storage for operation):
```cmd
kubectl apply -f k8s/pvc.yaml
kubectl get pvc
kubectl describe pvc calculator-pvc
```

---

## 21. Configure a Readiness Probe
Verify container health check mechanisms:
```cmd
kubectl apply -f k8s/readiness-probe.yaml
kubectl get pods -l demo=readiness-probe
kubectl describe pod -l demo=readiness-probe
```

---

## 22. Configure Jenkins
1. Open Jenkins at `http://localhost:3050`.
2. Create a new Item -> Name: `calculator-pipeline` -> Type: **Pipeline**.
3. In Pipeline settings, select **Pipeline script from SCM** -> SCM: **Git**.
4. Repository URL: Your GitHub repository URL.
5. Script Path: `Jenkinsfile`.

---

## 23. Configure Docker Hub Credentials
1. In Jenkins, go to **Manage Jenkins** -> **Credentials** -> **System** -> **Global credentials**.
2. Click **Add Credentials**.
3. Kind: **Username with password**.
4. Scope: **Global**.
5. Username: `midhunesh`
6. Password: Your Docker Hub Access Token / Password.
7. ID: `docker-new`.

---

## 24. Configure GitHub Integration
1. Push your repository to GitHub:
   ```cmd
   git init
   git add .
   git commit -m "Initial commit: Calculator web app with DevOps pipeline"
   git branch -M main
   git remote add origin <YOUR_GITHUB_REPO_URL>
   git push -u origin main
   ```
2. (Optional) Configure GitHub Webhooks to trigger Jenkins builds automatically on `git push`.

---

## 25. Execute the Jenkins Pipeline
1. In Jenkins, open `calculator-pipeline`.
2. Click **Build Now**.
3. Open the running build (`#1`) and click **Console Output** to monitor the 10 execution stages.

---

## 26. Verify the Deployment
Verify that all components were successfully created by Jenkins:
```cmd
kubectl get all -l app=calculator-web
```

---

## 27. Access the Calculator in a Browser
Open your browser and navigate to:
```
http://localhost:30080
```
Verify that the calculator loads, responds to button clicks, and performs calculations correctly.

---

## 28. Rolling Update Demonstration
Perform a zero-downtime rolling update:
```cmd
kubectl set image deployment/calculator-web calculator-web=midhunesh/calculator-web:latest --record
kubectl rollout status deployment/calculator-web
kubectl rollout history deployment/calculator-web
```

---

## 29. Troubleshooting Common Failures

### 1. `kubectl` command not found
* **Cause:** Kubernetes CLI is not added to the Windows System PATH.
* **Action:** Add `C:\Program Files\Docker\Docker\resources\bin` to your environment PATH, or open a fresh Command Prompt.

### 2. ImagePullBackOff / ErrImagePull
* **Cause:** Kubernetes cannot pull `midhunesh/calculator-web:latest` because it is private or not built/pushed.
* **Action:** Ensure `docker push` completed successfully in Jenkins, or set `imagePullPolicy: IfNotPresent` and build the image locally in Docker Desktop.

### 3. Service has no endpoints
* **Cause:** Service selector labels do not match Deployment Pod labels.
* **Action:** Verify `matchLabels` in `deployment.yaml` match `selector` in `service.yaml` (`app: calculator-web`).

### 4. Jenkins cannot access kubeconfig
* **Cause:** Incorrect file permissions or path in Jenkinsfile.
* **Action:** Ensure `C:\jenkins-kube\config` exists and is readable by the Jenkins service user.

---

## 30. Cleanup Commands
To remove all demo resources from your cluster and free up ports:
```cmd
kubectl delete -f k8s/service.yaml
kubectl delete -f k8s/deployment.yaml
kubectl delete -f k8s/configmap.yaml
kubectl delete -f k8s/pvc.yaml
kubectl delete -f k8s/namespace.yaml
docker rmi midhunesh/calculator-web:latest
```

---

## 31. Expected Results
* **Frontend:** Responsive, polished calculator widget operating smoothly in all modern browsers.
* **Docker:** Container successfully built, tested, and published to Docker Hub.
* **Kubernetes:** Deployments, Services, ConfigMaps, and PVCs running healthily with active readiness/liveness probes.
* **Jenkins:** Fully green 10-stage pipeline executing checkout, build, push, deploy, and verification automatically on Windows.

---

## 32. Conclusion
This project successfully demonstrates the complete software lifecycle under Agile methodologies—from static web development and containerization to Kubernetes orchestration and automated Jenkins CI/CD pipelines. It is fully prepared for faculty demonstration and laboratory assessment.
