import { useState, type ChangeEvent, type FormEvent, type JSX } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";

type TouchedState = {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
};

type RequiredField = "firstName" | "lastName" | "email";
const MIN_PASSWORD_LENGTH = 6;

export default function SignUpPage(): JSX.Element {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [agree, setAgree] = useState<boolean>(false);
  const signup = useAuthStore((state: any) => state.signup);
  const isSigningUp = useAuthStore((state: any) => state.isSigningUp);

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState<boolean>(false);
  const [touched, setTouched] = useState<TouchedState>({
    firstName: false,
    lastName: false,
    email: false,
  });

  const isPasswordTooShort = password.length > 0 && password.length < MIN_PASSWORD_LENGTH;
  const passwordsDoNotMatch = confirm.length > 0 && password !== confirm;

  const isFormValid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    password.length >= MIN_PASSWORD_LENGTH &&
    password === confirm &&
    agree;

  const shouldShowRequiredError = (fieldValue: string, fieldName: RequiredField): boolean => {
    return fieldValue.trim() === "" && (hasAttemptedSubmit || touched[fieldName]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    setTouched({ firstName: true, lastName: true, email: true });
    if (!isFormValid) return;

    const userData = { firstName, lastName, email, password };
    try {
      await signup(userData);
      clearForm();
    } catch (error) {
      console.log(error);
    }
  };

  const handleBlur = (fieldName: RequiredField): void => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  const clearForm = (): void => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirm("");
    setAgree(false);
    setHasAttemptedSubmit(false);
    setTouched({ firstName: false, lastName: false, email: false });
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>
            Join Virasat to explore, learn, and contribute to Indian heritage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                  onBlur={() => handleBlur("firstName")}
                />
                {shouldShowRequiredError(firstName, "firstName") && (
                  <p className="text-xs text-red-500">First name is required.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                  onBlur={() => handleBlur("lastName")}
                />
                {shouldShowRequiredError(lastName, "lastName") && (
                  <p className="text-xs text-red-500">Last name is required.</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email")}
              />
              {shouldShowRequiredError(email, "email") && (
                <p className="text-xs text-red-500">Email is required.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder={`Min ${MIN_PASSWORD_LENGTH} characters`}
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
              {isPasswordTooShort && (
                <p className="text-xs text-red-500">
                  Password must be at least {MIN_PASSWORD_LENGTH} characters.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="Re-enter your password"
                value={confirm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value)}
              />
              {passwordsDoNotMatch && (
                <p className="text-xs text-red-500">Passwords do not match.</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="agree"
                checked={agree}
                onCheckedChange={(v: boolean | "indeterminate") => setAgree(!!v)}
              />
              <Label htmlFor="agree" className="text-sm text-muted-foreground">
                I agree to the Terms of Service and Privacy Policy
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={!isFormValid || isSigningUp}>
              {isSigningUp ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/auth/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
