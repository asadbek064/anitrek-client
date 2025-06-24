import { useState } from "react"

const StripNavbarItem = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <>
            <div className=""></div>
        </>
    )
}

export default StripNavbarItem;