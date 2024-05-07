"use client";

import { createPushModal } from "pushmodal";

import CardSelectionSheet from "@/components/modals/card-selection-sheet";
import EditTicketDialog from "@/components/modals/edit-ticket-dialog";
import NewCardDialog from "@/components/modals/new-card-dialog";

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
