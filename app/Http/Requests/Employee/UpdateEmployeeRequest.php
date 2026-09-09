<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $employee = $this->route('employee');

        return [
            'name' => 'required|string|max:255',
            'position' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'is_active' => 'boolean',
            'employee_code' => ['sometimes', 'required', 'string', 'max:100', Rule::unique('employees', 'employee_code')->ignore($employee)],
        ];
    }
}
