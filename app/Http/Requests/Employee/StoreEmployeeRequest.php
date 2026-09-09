<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'employee_code' => 'required|string|max:100|unique:employees,employee_code',
            'position' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'tenant_id' => 'required|exists:tenants,id,is_active,1',
            'is_active' => 'boolean',
        ];

        if ($this->user()->employee && $this->user()->employee->tenant_id) {
            $rules['tenant_id'] = [$rules['tenant_id'][0]];
            $rules['tenant_id'] = ['required', 'in:'.$this->user()->employee->tenant_id];
        }

        return $rules;
    }
}
