import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <footer className="w-full py-6 flex items-center justify-center gap-2 text-sm text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800">
      Built with
      <FontAwesomeIcon
        icon={faHeart}
        className="text-red-600 mx-1 animate-pulse"
        aria-hidden="true"
      />
      by

      <a href="https://www.instagram.com/methamphetaminee_?igsh=N2FubzM3YTRrMWRo"
        target="_blank"
        rel="noreferrer"
        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>
        heisenberg
      </a>
    </footer>
  )
}