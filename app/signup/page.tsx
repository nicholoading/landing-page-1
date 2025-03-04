// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import Link from "next/link";

const validateEmail = (email: string): string => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email) ? "" : "Invalid email format";
};

const validateIC = (ic: string): string => {
  // This is a simple validation. Adjust according to the actual IC format in your country.
  const re = /^\d{12}$/;
  return re.test(ic) ? "" : "Invalid IC format. Must be 12 digits.";
};

const ProgressIndicator = ({ currentStep, totalSteps }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between relative">
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2" />
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="relative flex items-center justify-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 ${
              i < currentStep
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 border-2 border-gray-200"
            }`}
          >
            {i + 1}
          </div>
          {i < currentStep - 1 && (
            <div
              className="absolute h-1 bg-indigo-600"
              style={{
                width: `calc(100% - 2.5rem)`,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 0,
              }}
            />
          )}
        </div>
      ))}
    </div>
  </div>
);

const states = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Perak",
  "Perlis",
  "Pulau Pinang",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
  "Kuala Lumpur",
  "Labuan",
  "Putrajaya",
];

const races = [
  "Melayu",
  "Cina",
  "India",
  "Iban",
  "Bidayuh",
  "Melanau",
  "Kayan",
  "Kenyah",
  "Kelabit",
  "Lun Bawang",
  "Bisaya",
  "Kajang",
  "Penan",
  "Lain-lain bumiputra",
  "Lain-lain kaum",
];

const grades = [
  "Primary 6 (12 years old)",
  "Primary 5 (11 years old)",
  "Primary 4 (10 years old)",
  "Form 1 (13 years old)",
  "Form 2 (14 years old)",
  "Form 3 (15 years old)",
];

const codingExperiences = [
  "None",
  "Scratch",
  "Mblock",
  "Python",
  "JavaScript",
  "HTML/CSS",
  "Other",
];

const sizes = [
  { label: '3XS - 32"', value: "3xs" },
  { label: '2XS - 34"', value: "2xs" },
  { label: 'XS - 36"', value: "xs" },
  { label: 'S - 38"', value: "s" },
  { label: 'M - 40"', value: "m" },
  { label: 'L - 42"', value: "l" },
  { label: 'XL - 44"', value: "xl" },
  { label: '2XL - 46"', value: "2xl" },
  { label: '3XL - 48"', value: "3xl" },
];

interface FormData {
  teamName: string;
  representingSchool: string;
  schoolName: string;
  schoolAddress: string;
  postalCode: string;
  educationLevel: string;
  category: string;
  city: string;
  state: string;
  teacherName: string;
  teacherEmail: string;
  teacherPhone: string;
  teacherSchoolName: string;
  size: string;
  teacherIC: string;
  teamMembers: Array<{
    name: string;
    ic: string;
    gender: string;
    race: string;
    grade: string;
    schoolName: string;
    parentName: string;
    parentPhone: string;
    parentEmail: string;
    size: string;
    codingExperience: string;
  }>;
}

const initialFormData: FormData = {
  teamName: "",
  representingSchool: "no",
  schoolName: "",
  schoolAddress: "",
  postalCode: "",
  educationLevel: "",
  category: "",
  city: "",
  state: "",
  teacherName: "",
  teacherEmail: "",
  teacherPhone: "",
  teacherSchoolName: "",
  size: "",
  teacherIC: "",
  teamMembers: Array(3)
    .fill({})
    .map(() => ({
      name: "",
      ic: "",
      gender: "",
      race: "",
      grade: "",
      schoolName: "",
      parentName: "",
      parentPhone: "",
      parentEmail: "",
      size: "",
      codingExperience: "",
    })),
};

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [showResultModal, setShowResultModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const { name, value } = e.target;
    let error = "";

    if (name.includes("Email")) {
      error = validateEmail(value);
    } else if (name.includes("IC")) {
      error = validateIC(value);
    }

    setFormData((prev) => {
      if (index !== undefined) {
        const updatedTeamMembers = [...prev.teamMembers];
        updatedTeamMembers[index] = {
          ...updatedTeamMembers[index],
          [name]: value,
        };
        return {
          ...prev,
          teamMembers: updatedTeamMembers,
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });

    setError(error);
  };

  const handleSelectChange = (value: string, name: string, index?: number) => {
    setFormData((prev) => {
      if (index !== undefined) {
        const updatedTeamMembers = [...prev.teamMembers];
        updatedTeamMembers[index] = {
          ...updatedTeamMembers[index],
          [name]: value,
        };
        return {
          ...prev,
          teamMembers: updatedTeamMembers,
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      representingSchool: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!agreeToTerms) {
      setError("You must agree to the terms and conditions.");
      setIsLoading(false);
      return;
    }

    try {
      const formattedData = {
        ...formData,
        teamMembers: formData.teamMembers, // Store as JSONB
        registrationStatus: "Pending", // Default status
      };

      // 1️⃣ Register the team in Supabase
      const registerResponse = await fetch("/api/register-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) throw new Error(registerData.error);

      // 2️⃣ Send confirmation emails (Ensure all required fields are included)
      const emailPayload = {
        teamName: formData.teamName,
        teacherEmail: formData.teacherEmail,
        teacherName: formData.teacherName, // ✅ Include missing fields
        teacherPhone: formData.teacherPhone, // ✅ Ensure teacherPhone is sent
        teacherIC: formData.teacherIC, // ✅ Ensure teacherIC is sent
        teacherSchoolName: formData.teacherSchoolName,
        size: formData.size, // ✅ Include T-shirt size
        representingSchool: formData.representingSchool,
        schoolName: formData.schoolName,
        schoolAddress: formData.schoolAddress,
        postalCode: formData.postalCode,
        educationLevel: formData.educationLevel,
        category: formData.category,
        city: formData.city,
        state: formData.state,
        teamMembers: formData.teamMembers,
      };

      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailPayload), // ✅ Ensure correct payload
      });

      const emailData = await emailResponse.json();

      if (!emailResponse.ok) throw new Error(emailData.error);

      setIsSuccess(true);
      setShowResultModal(true);
    } catch (error) {
      console.error("Submission failed:", error);
      setIsSuccess(false);
      setShowResultModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseResultModal = () => {
    setShowResultModal(false);
    setAnimate(false);
    if (isSuccess) {
      router.push("/");
    }
  };

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
    scrollToTop();
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
    scrollToTop();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Team Information
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <InputField
                label="Team Name"
                name="teamName"
                value={formData.teamName}
                onChange={handleChange}
                required
              />
              <div className="space-y-2">
                <Label>Representing School</Label>
                <RadioGroup
                  name="representingSchool"
                  value={formData.representingSchool}
                  onValueChange={handleRadioChange}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="representingSchoolYes" />
                    <Label htmlFor="representingSchoolYes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="representingSchoolNo" />
                    <Label htmlFor="representingSchoolNo">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.representingSchool === "yes" && (
                <>
                  <InputField
                    label="School Name"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    required
                  />
                  <InputField
                    label="School Address"
                    name="schoolAddress"
                    value={formData.schoolAddress}
                    onChange={handleChange}
                    required
                  />
                  <InputField
                    label="Postal Code"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                  />
                </>
              )}
              <InputField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <SelectField
                label="State"
                name="state"
                value={formData.state}
                onChange={(value) => handleSelectChange(value, "state")}
                options={states}
                required
              />
              <SelectField
                label="Education Level"
                name="educationLevel"
                value={formData.educationLevel}
                onChange={(value) =>
                  handleSelectChange(value, "educationLevel")
                }
                options={["Primary", "Secondary"]}
                required
              />
              {formData.educationLevel === "Primary" && (
                <SelectField
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={(value) => handleSelectChange(value, "category")}
                  options={["Junior-Scratch"]}
                  required
                />
              )}

              {formData.educationLevel === "Secondary" && (
                <SelectField
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={(value) => handleSelectChange(value, "category")}
                  options={["Senior-Scratch", "Senior-HTML"]}
                  required
                />
              )}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Teacher Information
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <InputField
                label="Teacher Name"
                name="teacherName"
                value={formData.teacherName}
                onChange={handleChange}
                required
              />
              <InputField
                label="Teacher IC"
                name="teacherIC"
                value={formData.teacherIC}
                onChange={handleChange}
                required
              />
              <InputField
                label="Teacher Email"
                name="teacherEmail"
                type="email"
                value={formData.teacherEmail}
                onChange={handleChange}
                required
              />
              <InputField
                label="Teacher Phone"
                name="teacherPhone"
                type="tel"
                value={formData.teacherPhone}
                onChange={handleChange}
                required
              />

              {formData.representingSchool === "no" && (
                <InputField
                  label="School Name"
                  name="schoolName"
                  type="school"
                  value={formData.teacherSchoolName}
                  onChange={handleChange}
                  required
                />
              )}
              <div className="flex flex-col">
                <SelectField
                  label="T-Shirt Size"
                  name="size"
                  value={formData.size}
                  onChange={(value) => handleSelectChange(value, "size")}
                  options={sizes}
                  required
                />
                <Link
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-xs text-blue-600 underline hover:text-blue-800"
                >
                  Click here to see the T-shirt sizing.
                </Link>
              </div>
            </div>
          </>
        );
      case 3:
      case 4:
      case 5:
        const memberIndex = currentStep - 3;
        return (
          <>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Team Member {memberIndex + 1} Information
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {formData.representingSchool === "no" &&
                [
                  { label: "Name", name: "name", type: "text" },
                  { label: "IC", name: "ic", type: "text" },
                  { label: "School Name", name: "schoolName", type: "text" },
                ].map((field) => (
                  <InputField
                    key={`member-${memberIndex}-${field.name}`}
                    label={field.label}
                    name={field.name}
                    type={field.type}
                    value={formData.teamMembers[memberIndex][field.name]}
                    onChange={(e) => handleChange(e, memberIndex)}
                    required
                  />
                ))}

              {formData.representingSchool === "yes" &&
                [
                  { label: "Name", name: "name", type: "text" },
                  { label: "IC", name: "ic", type: "text" },
                ].map((field) => (
                  <InputField
                    key={`member-${memberIndex}-${field.name}`}
                    label={field.label}
                    name={field.name}
                    type={field.type}
                    value={formData.teamMembers[memberIndex][field.name]}
                    onChange={(e) => handleChange(e, memberIndex)}
                    required
                  />
                ))}
              <SelectField
                key={`member-${memberIndex}-gender`}
                label="Gender"
                name="gender"
                value={formData.teamMembers[memberIndex].gender}
                onChange={(value) =>
                  handleSelectChange(value, "gender", memberIndex)
                }
                options={["Male", "Female"]}
                required
              />
              <SelectField
                key={`member-${memberIndex}-race`}
                label="Race"
                name="race"
                value={formData.teamMembers[memberIndex].race}
                onChange={(value) =>
                  handleSelectChange(value, "race", memberIndex)
                }
                options={races}
                required
              />
              <SelectField
                key={`member-${memberIndex}-grade`}
                label="Grade"
                name="grade"
                value={formData.teamMembers[memberIndex].grade}
                onChange={(value) =>
                  handleSelectChange(value, "grade", memberIndex)
                }
                options={grades}
                required
              />

              <div className="flex flex-col">
                <SelectField
                  key={`member-${memberIndex}-size`}
                  label="T-Shirt Size"
                  name="size"
                  value={formData.teamMembers[memberIndex].size}
                  onChange={(value) =>
                    handleSelectChange(value, "size", memberIndex)
                  }
                  options={sizes}
                  required
                />
                <Link
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-xs text-blue-600 underline hover:text-blue-800"
                >
                  Click here to see the T-shirt sizing.
                </Link>
              </div>

              <SelectField
                key={`member-${memberIndex}-coding`}
                label="Coding Experience"
                name="codingExperience"
                value={formData.teamMembers[memberIndex].codingExperience}
                onChange={(value) =>
                  handleSelectChange(value, "codingExperience", memberIndex)
                }
                options={codingExperiences}
                required
              />
              {[
                { label: "Parent Name", name: "parentName", type: "text" },
                { label: "Parent Phone", name: "parentPhone", type: "tel" },
                { label: "Parent Email", name: "parentEmail", type: "email" },
              ].map((field) => (
                <InputField
                  key={`member-${memberIndex}-${field.name}`}
                  label={field.label}
                  name={field.name}
                  type={field.type}
                  value={formData.teamMembers[memberIndex][field.name]}
                  onChange={(e) => handleChange(e, memberIndex)}
                  required
                />
              ))}
            </div>
          </>
        );
      case 6:
        return (
          <>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Terms and Conditions
            </h3>
            <div className="space-y-4">
              <div className="text-sm text-gray-700">
                I understand and agree that the text, photographs, and/or videos
                containing the words, image and/or voice of all the participants
                above may be used in the production of instructional and/or
                promotional materials produced by or on behalf of Realfun
                Academy Sdn. Bhd. and that such materials may be distributed or
                broadcast to the public and displayed publicly.
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) =>
                    setAgreeToTerms(checked as boolean)
                  }
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions
                </label>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (showResultModal) {
      const timer = setTimeout(() => setAnimate(true), 100);
      return () => clearTimeout(timer);
    }
  }, [showResultModal]);

  return (
    <div className="min-h-[120vh] bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign up for the Hackathon
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <ProgressIndicator currentStep={currentStep} totalSteps={6} />
          <form className="space-y-6" onSubmit={handleSubmit}>
            {renderStep()}

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div className="flex justify-between">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Previous
                </Button>
              )}
              {currentStep < 6 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center items-center"
                >
                  {isLoading ? (
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
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Result Modal */}
      <Dialog open={showResultModal} onOpenChange={setShowResultModal}>
        <DialogContent>
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <svg className="w-24 h-24" viewBox="0 0 100 100">
                <circle
                  className={`${
                    isSuccess ? "text-green-500" : "text-red-500"
                  } stroke-current`}
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                />
                {isSuccess ? (
                  <path
                    className={`text-green-500 stroke-current ${
                      animate ? "animate-draw-tick" : ""
                    }`}
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    d="M25,50 L40,65 L75,30"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <>
                    <path
                      className={`text-red-500 stroke-current ${
                        animate ? "animate-draw-cross" : ""
                      }`}
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      d="M25,25 L75,75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      className={`text-red-500 stroke-current ${
                        animate ? "animate-draw-cross" : ""
                      }`}
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      d="M75,25 L25,75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                )}
              </svg>
            </div>
            <DialogTitle>
              {isSuccess ? "Submission Successful!" : "Submission Failed"}
            </DialogTitle>
            <DialogDescription>
              {isSuccess
                ? "Thank you for signing up for the Hackathon. We've received your registration and will be in touch soon."
                : "There was an error submitting your form. Please try again later."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleCloseResultModal}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast component for error messages */}
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>

      <style jsx global>{`
        @keyframes draw-tick {
          0% {
            stroke-dasharray: 0, 100;
          }
          100% {
            stroke-dasharray: 100, 100;
          }
        }
        .animate-draw-tick {
          animation: draw-tick 0.5s ease-out forwards;
        }
        @keyframes draw-cross {
          0% {
            stroke-dasharray: 0, 100;
          }
          100% {
            stroke-dasharray: 100, 100;
          }
        }
        .animate-draw-cross {
          animation: draw-cross 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
}) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <Input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={name}>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value || option}
            value={option.value || option}
          >
            {option.label || option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
