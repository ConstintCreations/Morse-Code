import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export default function HomePageArrow() {
    return(
        <div className="absolute top-10 left-10">
            <FontAwesomeIcon icon={faArrowLeft} size="2x" className="text-gray-500 hover:text-gray-200 cursor-pointer transition-colors duration-300 ease-in-out" onClick={() => window.location.href = '/'} />
        </div>
    )
}