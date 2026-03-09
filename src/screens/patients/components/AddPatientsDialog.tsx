"use client"
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { UserPlus } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { patientsSchema, type PatientsFormValues } from "../Schema/patientsSchema";
import { useUserStore } from "@/store/useUserStore";
import type { IUser } from "@/common/Users";
import { useId } from 'react';

export function AddPatientsDialog() {
  const { t } = useTranslation();
  const { addUser } = useUserStore();
  const baseId = useId(); 
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PatientsFormValues>({
    resolver: zodResolver(patientsSchema),
    mode: "onChange"
  });

  const onSubmit = (data: PatientsFormValues) => {
  const numericId = Math.abs(baseId.split(':').join('').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
  const newUser: IUser = {
    id: numericId, 
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone_number: data.phoneNumber,
    role: "Patient",
    patient_modules: null,
  };

  addUser(newUser);
  reset();
  console.log("Patient added:", newUser);
};

const renderField = (id: keyof PatientsFormValues, type = "text") => (
  <div key={id} className="space-y-1.5 flex-1 text-right">
    <label className="text-sm font-bold text-foreground flex items-center gap-1">
       {t(`patients.${id}Label`)}
       <span className="text-destructive">*</span>
    </label>

    <Input 
      {...register(id)} 
      type={type}
      placeholder={t(`patients.${id}Placeholder`)} 
      className={errors[id] 
        ? "border-destructive focus-visible:ring-destructive" 
        : "border-border bg-background focus-visible:ring-primary"
      } 
    />
    
    {errors[id] && (
      <p className="text-[10px] text-destructive font-medium leading-none">
        {t(errors[id]?.message as string)}
      </p>
    )}
  </div>
);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex gap-2 h-11 px-6 font-bold shadow-sm transition-all">
          <UserPlus size={20} /> {t("patients.addNew")}
        </Button>
      </DialogTrigger>
      
         <DialogContent className="sm:max-w-[500px] bg-card border-border p-8" dir="ltr">
            <DialogHeader>
          <DialogTitle className="text-3xl font-extrabold text-center text-foreground mb-4">
            {t("patients.registerTitle")}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
  {/* Name*/}
  <div className="flex gap-4">
    {renderField("firstName")}
    {renderField("lastName")}
  </div>

  {/* Middle fields*/}
  <div className="space-y-4">
    {renderField("email", "email")}
    {renderField("phoneNumber", "tel")}
  </div>

  {/* Password fields */}
  <div className="flex gap-4">
    {renderField("password", "password")}
    {renderField("confirmPassword", "password")}
  </div>

<Button 
  type="submit" 
  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-bold rounded-full mt-6 transition-colors shadow-sm"
>
  {t("patients.registerButton")}
</Button>
</form>
      </DialogContent>
    </Dialog>
  );
}