
import logoUta from '../assets/logoUta.svg';

import '../css/Loading.css'

export function Loading() {
    return (
        <main className='main-loading'>

            {/* <div className="App"> */}
            <img className='loading-logo' src={logoUta} alt="Logo Uta" />
            {/* </div> */}
            <div className='loading-effect'>

            </div>
        </main>
    )
}