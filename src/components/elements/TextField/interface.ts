export interface TextFieldProps {
  className: string;
  onChange?: (e: any) => void;
  onKeyDown?: (e: any) => void;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  value?: string;
}
