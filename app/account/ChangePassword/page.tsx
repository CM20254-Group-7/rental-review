'use client'
import Link from 'next/link'
import { NewPasswordForm } from './forms'

export default function ChangePassword() {

    return (
      <div className="relative flex-1 flex px-8 justify-center place-items-center">

          <div className="grid grid-cols-1 [@media(min-width:996px)]:grid-cols-2 gap-8 w-full">
          <NewPasswordForm />
          </div>   
        </div>

        
    )
}  