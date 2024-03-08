import Link from 'next/link';
import GetInfo from './DisplayInfo';

const AccountForm = () => (
  <div className='form-widget'>
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
  </div>
);

export default AccountForm;
