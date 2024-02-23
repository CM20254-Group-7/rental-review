export default async function Index() {

  return (
    <div>
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <Header/>
      </div>

      <div>
        <main>
          <div title="General information.">
            <h2 className="font-bold text-xl ml-10 mb-1">General Info</h2>
            <p className="ml-5 mr-5 mb-10 text-indent:20px">
              This web app is designed to help tenants 
              view properties and get verified information 
              about them from previous tenants. Users are 
              able to leave reviews for a property or 
              landlord. Equally, we help tenants and landlords to 
              verify reviews and report any misinformation.
            </p>
          </div>

          <div title="About us.">
            <h2 className="font-bold text-xl ml-10 mb-1">About Us</h2>
            <p className="ml-5 mr-5 mb-10">
              We are a diverse collection of students 
              from the University of Bath, located in 
              the United Kingdom. We are working together 
              on this project with the sole purpose of 
              helping tenants (and landlords) get better 
              information about where they'll be living, 
              along with information about landlords 
              which might not be freely available. <br></br>
              The goal of this is to balance the power dynamic 
              between tenants and landlords, the latter of which 
              being capable of verifying information about tenants, 
              which is not applicable the other way around. We 
              want to avoid problems such as landlords leaving the 
              house in unliveable conditions, or more minor things 
              such as the landlord being impossible to contact. 
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
