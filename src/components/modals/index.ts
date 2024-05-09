"use client";

import { createPushModal } from "pushmodal";

import EditTicketDialog from "@/components/modals/edit-ticket-dialog";
import NewCardDialog from "@/components/modals/new-card-dialog";
import CardSelectionSheet from "@/components/tickets/ticket-payment-sheet-button";

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
    cardSelectionSheet: CardSelectionSheet,
    newCardDialog: NewCardDialog,
  },
});
