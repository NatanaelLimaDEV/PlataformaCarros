import { signOut } from "firebase/auth";
import { auth } from "../../Services/firebaseConnection";
import { Link } from "react-router";
import { useState } from "react";
import { FiX } from "react-icons/fi";

type Props = {
  select: number;
};

export function DashboardHeader({ select }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <header className="bg-red-500 text-white rounded-lg h-10 font-medium px-4 mb-4 flex relative">
      <div className="flex items-center w-full">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none"
        >
          {menuOpen ? (
            <FiX size={20}/>
          ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 8h16M4 16h16"
            />
          </svg>
        )}
        </button>

        <button
          className={`ml-auto md:hidden`}
          onClick={handleLogout}
        >
          Sair da conta
        </button>

        <nav className="hidden md:flex w-full items-center gap-6">
          <Link
            to="/Dashboard"
            className="transition-all duration-300 ease-in-out hover:scale-90"
            style={{ color: select === 1 ? "#000" : "none" }}
          >
            Dashboard
          </Link>
          <Link
            to="/Dashboard/New"
            className="transition-all duration-300 ease-in-out hover:scale-90"
            style={{ color: select === 2 ? "#000" : "none" }}
          >
            Cadastrar carro
          </Link>
          <Link
            to="/User"
            className="transition-all duration-300 ease-in-out hover:scale-90"
            style={{ color: select === 3 ? "#000" : "none" }}
          >
            Dados da conta
          </Link>
          <button
            className="transition-all duration-300 ease-in-out ml-auto hover:scale-90 cursor-pointer"
            onClick={handleLogout}
          >
            Sair da conta
          </button>
        </nav>
      </div>

      {menuOpen && (
        <div className="w-fit items-center flex flex-col bg-red-500 h-fit absolute z-50 mt-11 p-4 left-0 rounded-lg shadow">
          <Link
            to="/Dashboard"
            className=""
            style={{ color: select === 1 ? "#000" : "none" }}
          >
            Dashboard
          </Link>
          <Link
            to="/Dashboard/New"
            className="whitespace-nowrap"
            style={{ color: select === 2 ? "#000" : "none" }}
          >
            Cadastrar carro
          </Link>
          <Link
            to="/User"
            className="whitespace-nowrap"
            style={{ color: select === 3 ? "#000" : "none" }}
          >
            Dados da conta
          </Link>
        </div>
      )}
    </header>
  );
}
