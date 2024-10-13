import React from 'react'
import UserRecords from '../ManageUsers/UserRecords';

const PremiumModal = (
    { isModalOpen,
        modalData,
        closeModal }:
        {
            isModalOpen: boolean,
            modalData: any
            closeModal: () => void
        }) => {

    return (
        isModalOpen ? (
            <div className="">
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    {/* Modal content */}
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg min-w-fit p-8 relative">
                        {/* Close button */}
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition duration-300 ease-in-out"
                            onClick={closeModal}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Modal title */}
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">{modalData.full_name ?? ""}</h2>

                        <UserRecords data={modalData.useractivity_data} />

                        {/* Action buttons */}
                        <div className="flex justify-end space-x-4 mt-6">

                            <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold rounded-full hover:shadow-lg transition duration-300 ease-in-out" onClick={closeModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ) : <></>
    )
}

export default PremiumModal