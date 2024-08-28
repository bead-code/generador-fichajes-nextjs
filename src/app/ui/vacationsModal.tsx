"use client";
import { useState } from "react";
import { Modal } from "./modal";
import { Employee, Vacation } from "../lib/definitions";

function VacationsDateField({ text, value, onChange }: { text: string, value: string, onChange: (e: any) => void }) {
    return (
        <div className="flex gap-2">
            <p className="mr-auto">{text}</p>
            <input
                type="date"
                value={value}
                onChange={onChange}
                className="border border-gray-300 rounded p-1 w-48"
                required
            />
        </div>
    );
}

export function VacationsModal({ title, baseURL, employee, handleSubmitVacations, initialVacation = {
    id: 0,
    start_date: "",
    end_date: "",
    employee_id: employee.id
}, cancelText, submitText }: { title: string, baseURL: string, employee: Employee, handleSubmitVacations: (vacation: Vacation) => void, initialVacation?: Vacation, cancelText?: string, submitText?: string }) {
    const [showModal, setShowModal] = useState(true);
    const [vacation, setVacation] = useState(initialVacation);
    const submitable: boolean = vacation.start_date !== undefined && vacation.end_date !== undefined;

    return (<div>{showModal && (
        <Modal
            title={title}
            onClose={() => setShowModal(false)}
            onSubmit={() => handleSubmitVacations(vacation)}
            submitText={submitText ?? "Guardar"}
            cancelText={cancelText ?? "Cancelar"}
            baseURL={baseURL}
            submitable={submitable}
        >
            <form className="flex flex-col gap-2">
                <VacationsDateField text="Inicio" value={vacation.start_date} onChange={(e) => setVacation({...vacation, start_date: e.target.value})} />
                <VacationsDateField text="Fin" value={vacation.end_date} onChange={(e) => setVacation({...vacation, end_date: e.target.value})} />
            </form>
        </Modal>
    )}</div>);
}

export function ShowVacationsModal({ title, baseURL, vacations, cancelText }: { title: string, baseURL: string, vacations: Vacation[], cancelText?: string }) {
    const [showModal, setShowModal] = useState(true);
    console.log("----", vacations);

    if (!vacations) {
        return <div>No hay vacaciones</div>;
    }    

    return (<div>{showModal && (
        <Modal
            title={title}
            onClose={() => setShowModal(false)}
            cancelText={cancelText ?? "Cerrar"}
            submitText=""
            baseURL={baseURL}
            submitable={false}
            onSubmit={() => { }}
        >
            <div className="flex flex-col gap-2">
                {vacations.map((vacation) => (
                    <div key={vacation.id} className="flex gap-2">
                        <p>{vacation.start_date} - {vacation.end_date}</p>
                    </div>
                ))}
            </div>
        </Modal>
    )}</div>);
}
