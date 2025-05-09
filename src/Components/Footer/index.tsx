import { FaCopyright } from "react-icons/fa";


export default function Footer(){
    return (
        <div className="bg-zinc-800 w-full h-8 mt-4 text-zinc-300 flex items-center justify-center">
            <p className="w-full flex items-center justify-center gap-1 text-xs">
                <FaCopyright size={15}/>
                2025 - Natanael Lima | Todos os direitos reservados.
            </p>
        </div>
    )
}