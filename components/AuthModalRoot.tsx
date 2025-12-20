"use client";

import AuthModal from "@/components/AuthModal";
import { useAuthModal } from "@/stores/useAuthModal";

export default function AuthModalRoot() {
  const { open, closeModal } = useAuthModal();

  return (
    <AuthModal
      isOpen={open}
      onClose={closeModal}
    />
  );
}
