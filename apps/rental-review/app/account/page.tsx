import Link from 'next/link';
import GetInfo from './DisplayInfo';

const AccountForm = () => (
  <main className='form-widget flex flex-1 place-items-center justify-center py-10 md:py-16'>
    <form>
      <div>
        <GetInfo />
      </div>
      <div>
        <Link href='/account/ChangeGeneralAccountInfo'>
          <button className='password' type='submit'>
            Edit Account Infomation
          </button>
        </Link>
        <br />
        <Link href='/account/ChangePassword'>
          <button className='password' type='submit'>
            Change Password
          </button>
        </Link>
      </div>
    </form>
  </main>
);

export default AccountForm;
