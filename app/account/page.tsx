'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

import Link from "next/link";
import GetInfo from './DisplayInfo';



export default function AccountForm() {

  return (
    <div className="form-widget">
      <form>
        <div>
          <GetInfo />
        </div>
        <div>
          <Link href="/account/ChangeGeneralAccountInfo">
            <button className="password" type="submit" >
              Edit Account Infomation
            </button>
          </Link>
          <br></br>
          <Link href="/account/ChangePassword">
          <button className="password" type="submit" >
            Change Password
          </button>
          </Link>
        </div>
      </form>
    </div>
  )
}