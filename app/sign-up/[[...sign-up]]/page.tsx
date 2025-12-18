"use client";

import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  ArrowRight,
  AlertCircle,
  ChefHat,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { z } from "zod";

const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    // Validation
    const result = signUpSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0] || "",
        password: fieldErrors.password?.[0] || "",
        firstName: fieldErrors.firstName?.[0] || "",
        lastName: fieldErrors.lastName?.[0] || "",
      });
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      // prepare email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      const errorMessage =
        err.errors?.[0]?.longMessage || "An error occurred. Please try again.";
      console.error("error", errorMessage);
      setErrors({ form: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err: any) {
      const errorMessage =
        err.errors?.[0]?.longMessage ||
        "Verification failed. Please try again.";

      // If verification was already completed, offer to restart
      if (errorMessage.includes("already been verified")) {
        setErrors({
          form: "This code has already been verified. Redirecting...",
        });
        setTimeout(() => {
          setPendingVerification(false);
          setCode("");
          setErrors({});
        }, 2000);
      } else {
        // Log as warning since incorrect code is a predictable user error
        console.warn("Verification failed:", errorMessage);
        setErrors({ form: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 pt-20 relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-orange-900/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[380px] relative z-10"
      >
        <div className="bg-[#0A0A0A] border border-stone-800/60 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
          {!pendingVerification ? (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white mb-1.5 tracking-tight font-display">
                  Join Platera
                </h1>
                <p className="text-stone-400 text-xs">
                  Create your profile and start sharing
                </p>
              </div>

              {/* OAuth Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() =>
                    signUp?.authenticateWithRedirect({
                      strategy: "oauth_google",
                      redirectUrl: "/sso-callback",
                      redirectUrlComplete: "/dashboard",
                    })
                  }
                  className="flex items-center justify-center gap-2 bg-[#111] hover:bg-[#1A1A1A] border border-stone-800 rounded-lg py-2.5 transition-all duration-300 group hover:border-stone-700"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="text-white text-xs font-medium group-hover:text-white/90">
                    Google
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    signUp?.authenticateWithRedirect({
                      strategy: "oauth_discord",
                      redirectUrl: "/sso-callback",
                      redirectUrlComplete: "/dashboard",
                    })
                  }
                  className="flex items-center justify-center gap-2 bg-[#111] hover:bg-[#5865F2]/10 border border-stone-800 rounded-lg py-2.5 transition-all duration-300 group hover:border-[#5865F2]/50"
                >
                  <svg
                    className="w-4 h-4 text-[#5865F2]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1892.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.1023.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
                  </svg>
                  <span className="text-white text-xs font-medium group-hover:text-[#5865F2]">
                    Discord
                  </span>
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-800"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                  <span className="bg-[#0A0A0A] px-2 text-stone-600">
                    Or sign up with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.form && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-500 text-xs overflow-hidden"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <p>{errors.form}</p>
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full bg-[#111] border border-stone-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-stone-700 focus:outline-none focus:border-[#FF6A00]/40 focus:bg-[#161616] transition-all duration-300 caret-[#FF6A00]"
                      placeholder="Gordon"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-[10px] ml-1 font-medium">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full bg-[#111] border border-stone-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-stone-700 focus:outline-none focus:border-[#FF6A00]/40 focus:bg-[#161616] transition-all duration-300 caret-[#FF6A00]"
                      placeholder="Ramsay"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-[10px] ml-1 font-medium">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-[#111] border border-stone-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-stone-700 focus:outline-none focus:border-[#FF6A00]/40 focus:bg-[#161616] transition-all duration-300 caret-[#FF6A00]"
                    placeholder="chef@platera.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-[10px] ml-1 font-medium">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full bg-[#111] border border-stone-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-stone-700 focus:outline-none focus:border-[#FF6A00]/40 focus:bg-[#161616] transition-all duration-300 caret-[#FF6A00] pr-10"
                      placeholder="Min. 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-[10px] ml-1 font-medium">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Clerk CAPTCHA widget for bot protection */}
                <div id="clerk-captcha" />

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#FF6A00] hover:bg-[#FF8533] text-black font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,106,0,0.15)] hover:shadow-[0_0_25px_rgba(255,106,0,0.3)] disabled:opacity-70 disabled:cursor-not-allowed group text-sm"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-4 border-t border-stone-900 text-center text-xs text-stone-500">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="text-white hover:text-[#FF6A00] font-medium transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-[#FF6A00]/10 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-[#FF6A00]" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-1.5 font-display">
                Check your email
              </h2>
              <p className="text-stone-400 text-xs mb-6">
                We've sent a verification code to <br />
                <span className="text-white font-medium">{formData.email}</span>
              </p>

              <form onSubmit={onPressVerify} className="space-y-4">
                <div className="space-y-1.5">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-[#111] border border-stone-800 rounded-lg px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono text-white placeholder:text-stone-800 focus:outline-none focus:border-[#FF6A00]/40 focus:bg-[#161616] transition-all duration-300"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FF6A00] hover:bg-[#FF8533] text-black font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,106,0,0.15)] hover:shadow-[0_0_25px_rgba(255,106,0,0.3)] disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Verify Email"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
