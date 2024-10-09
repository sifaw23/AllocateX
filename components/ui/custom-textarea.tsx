import React from 'react'
import { Textarea, TextareaProps } from "./textarea"

interface CustomTextareaProps extends TextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const CustomTextarea: React.FC<CustomTextareaProps> = ({ className, ...props }) => {
  return <Textarea className={className} {...props} />
}