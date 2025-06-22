import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Camera, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FaceIDScan = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [faceDetected, setFaceDetected] = useState(false);
    const studentEmail = sessionStorage.getItem('studentEmail');
    const studentRole = sessionStorage.getItem('studentRole');

    if (!studentEmail || !studentRole) {
        navigate("/student-login");
        return null;
    }

    useEffect(() => {
        startCamera();
    }, []);

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
            toast({
                variant: "destructive",
                title: "Camera Access Denied",
                description: "Please allow camera access to use face scanning.",
            });
        }
    };

    // Simulate face detection API call
    const detectFace = async (imageData: string) => {
        // TODO: Replace with real API call
        // For now, simulate detection with a random result
        return new Promise<boolean>((resolve) => {
            setTimeout(() => {
                resolve(true); // Always detect a face for now
            }, 1000);
        });
    };

    const captureImage = async () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0);

                // Convert to base64 for processing
                const imageData = canvas.toDataURL('image/jpeg');
                console.log("Captured image data:", imageData.substring(0, 50) + "...");

                setIsScanning(true);
                // Call face detection API (simulated)
                const detected = await detectFace(imageData);
                setIsScanning(false);
                if (detected) {
                    setFaceDetected(true);
                    toast({
                        title: "Face Scan Complete",
                        description: "Verification successful! Redirecting...",
                    });
                    setTimeout(() => {
                        navigate("/student-login"); // or to a dashboard
                    }, 1500);
                } else {
                    toast({
                        variant: "destructive",
                        title: "Face Not Detected",
                        description: "Please try again and ensure your face is visible.",
                    });
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative">
            <Button
                variant="ghost"
                className="absolute top-4 left-4"
                onClick={() => navigate('/student-login')}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
            </Button>
            <Card className="w-full max-w-md bg-transparent shadow-none border-none">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Face ID Verification</CardTitle>
                    <CardDescription className="text-center">
                        Position your face within the frame
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-6 pt-6">
                    <div className="w-64 h-64 bg-gray-200 bg-opacity-30 rounded-lg flex items-center justify-center relative overflow-hidden">
                        {stream ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Camera className="h-24 w-24 text-gray-500" />
                        )}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Email: <span className="font-bold">{studentEmail}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Role: <span className="font-bold">{studentRole}</span>
                        </p>
                    </div>
                    <div className="w-full space-y-2">
                        {!stream ? (
                            <Button onClick={startCamera} className="w-full">
                                Start Camera
                            </Button>
                        ) : (
                            <Button
                                onClick={captureImage}
                                className="w-full"
                                disabled={isScanning || faceDetected}
                            >
                                {isScanning ? "Scanning..." : faceDetected ? "Face Detected" : "Scan Face"}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FaceIDScan;
