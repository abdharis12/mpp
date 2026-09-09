<?php

namespace App\Enums;

enum CorrectionStatus: string
{
    case Pending = 'PENDING';
    case Approved = 'APPROVED';
    case Rejected = 'REJECTED';
    case Cancelled = 'CANCELLED';
}
