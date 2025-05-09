import { Link, useNavigate } from 'react-router';
import logoImg from '../../assets/logo.svg'
import Container from "../../Components/Container";
import { Input } from '../../Components/Input';
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../../Services/firebaseConnection';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email("Insira um email válido").nonempty("O campo email é obrigatório"),
  password: z.string().nonempty("O campo senha é obrigatório")
})

type FormData = z.infer<typeof schema>

export default function Login() {
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  useEffect(() => {
    async function handleLogout() {
      await signOut(auth)
    }

    handleLogout()
  }, [])

  function onSubmit(data: FormData){
    signInWithEmailAndPassword(auth, data.email, data.password)
    .then((user) => {
      console.log("Logado com sucesso");
      console.log(user)
      toast.success("Logado com sucesso!")
      navigate("/Dashboard", { replace: true })
    })
    .catch(erro => {
      console.log("Erro ao logar");
      console.log(erro);
      toast.error("Erro ao fazer login!")
    })
  }

  return (
    <Container>
      <div className='w-full min-h-screen flex justify-center items-center flex-col gap-4'>
        <Link to="/" className='mb-6 max-w-sm w-full'>
          <img src={logoImg} alt="logo do site" className='w-full' />
        </Link>

        <form className='bg-white max-w-xl w-full rounded-lg p-4'
        onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-3'>
            <Input
              type="email"
              placeholder="Digite seu email..."
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>
          <div className='mb-3'>
            <Input
              type="password"
              placeholder="Digite seu senha..."
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>

          <button type='submit' className='bg-zinc-900 w-full rounded-md text-white h-10 font-medium cursor-pointer'>Acessar</button>
        </form>

        <Link to="/Register">Ainda não possui uma conta? Cadastre-se!</Link>
      </div>
    </Container>
  );
}
