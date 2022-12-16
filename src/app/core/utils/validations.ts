import { AbstractControl } from "@angular/forms";



export function mustBeBefore(control: AbstractControl) {
  const controlFI = control.get('endDate') as AbstractControl;
  const starDate = new Date(control.get('starDate')?.value);
  const endDate = new Date(control.get('endDate')?.value);
  if (control.get('endDate')?.value !== null && control.get('starDate')?.value !== null) {
    if (starDate.getTime() > endDate.getTime()) {
      controlFI.setErrors({ mustBeBefore: true })
    } else {
      controlFI.setErrors(null)
    }
  }
}
