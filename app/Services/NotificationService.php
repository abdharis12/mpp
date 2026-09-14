<?php

namespace App\Services;

use App\Models\InAppNotification;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class NotificationService
{
    public static function notifyUser(
        int $userId,
        string $title,
        string $message,
        string $type,
        ?string $url = null,
    ): InAppNotification {
        return InAppNotification::create([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'url' => $url,
        ]);
    }

    public static function notifyAllActive(
        string $title,
        string $message,
        string $type,
        ?string $url = null,
    ): Collection {
        $users = User::where('is_active', true)->get();

        $notifications = [];

        foreach ($users as $user) {
            $notifications[] = static::notifyUser($user->id, $title, $message, $type, $url);
        }

        return new Collection($notifications);
    }

    public static function notifyUsersWithPermission(
        string|array $permission,
        string $title,
        string $message,
        string $type,
        ?string $url = null,
    ): Collection {
        $permissions = (array) $permission;

        $users = User::where('is_active', true)
            ->whereHas('roles', fn ($q) => $q->whereHas('permissions', fn ($q) => $q->whereIn('name', $permissions)))
            ->get();

        $notifications = [];

        foreach ($users as $user) {
            $notifications[] = static::notifyUser($user->id, $title, $message, $type, $url);
        }

        return new Collection($notifications);
    }
}
