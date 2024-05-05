"use client";

import { createPushModal } from "pushmodal";

import EditTicketDialog from "@/components/modals/edit-ticket";

export const {
  pushModal,
  popModal,
  popAllModals,
  replaceWithModal,
  useOnPushModal,
  onPushModal,
  ModalProvider,
} = createPushModal({
  modals: {
    editTicketDialog: EditTicketDialog,
  },
});
