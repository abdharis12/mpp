import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type ReactNode, useEffect, useRef, useState } from 'react';

type ConfirmDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    processing?: boolean;
    onConfirm: () => void;
    /** 'danger' = destructive (red), 'warning' = non-destructive (blue) */
    variant?: 'danger' | 'warning';
    /** Set a random string the user must type to enable confirm */
    confirmWith?: {
        label: string;
        match: string;
        placeholder?: string;
    };
    /** Extra content between description and footer */
    children?: ReactNode;
};

export default function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = 'Hapus',
    cancelLabel = 'Batal',
    processing = false,
    onConfirm,
    variant = 'danger',
    confirmWith,
    children,
}: ConfirmDialogProps) {
    const [confirmInput, setConfirmInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!open) {
            setConfirmInput('');
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            // Small delay so the dialog is mounted
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    }, [open]);

    const matches =
        !confirmWith || confirmInput === confirmWith.match;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>

                {children}

                {confirmWith && (
                    <div className="space-y-2">
                        <Label
                            htmlFor="confirm-input"
                            className="text-foreground text-sm"
                        >
                            {confirmWith.label}
                        </Label>
                        <Input
                            ref={inputRef}
                            id="confirm-input"
                            value={confirmInput}
                            onChange={(e) => setConfirmInput(e.target.value)}
                            placeholder={confirmWith.placeholder}
                            autoComplete="off"
                        />
                    </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0">
                    <DialogClose asChild>
                        <Button variant="secondary">{cancelLabel}</Button>
                    </DialogClose>
                    <Button
                        variant={
                            variant === 'danger' ? 'destructive' : 'default'
                        }
                        disabled={processing || !matches}
                        onClick={onConfirm}
                    >
                        {processing ? 'Memproses…' : confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
