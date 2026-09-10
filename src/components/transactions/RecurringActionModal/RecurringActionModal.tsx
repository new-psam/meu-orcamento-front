import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal/Modal";

export type RecurringActionType = "SINGLE" | "ALL";

interface RecurringActionProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (actionType: RecurringActionType) => void;
    actionName: "edit" | "delete";
}

export function RecurringActionModal({ isOpen, onClose, onConfirm, actionName}: RecurringActionProps) {
    if (!isOpen) return null;

    const isEdit = actionName === "edit";
    const title = isEdit ? "Editar Transação Recorrente" : "Excluir Transação Recorrente";
    const description = isEdit
        ? "Você está prestes a alterar uma transação que se repete. Como deseja aplicar esta alteração?"
        : "Você está prestes a apagar uma transação que se repete. O que deseja excluir?";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} isLoading={false}>
            <div className="space-y-6">
                <p className="text-sm text-gray-600">
                    {description}
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Button
                        type="button"
                        onClick={() => onConfirm("SINGLE")}
                        className="bg-white text-blue-700 border border-blue-200 hover:bg-blue-50"
                    >
                        Somente Esta
                    </Button>

                    <Button
                        type="button"
                        onClick={() => onConfirm("ALL")}
                        className={isEdit ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"}
                    >
                        Esta e as próximas
                    </Button>
                </div>
            </div>
        </Modal>
    )
}