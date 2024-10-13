import React, { Suspense, useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router'
import PageNotFound from './PageNotFound';
import Dashboard from '../components/Panel/Dashboard/Dashboard';
import SectionOne from '../components/Panel/Dashboard/SectionOne';
import Sidebar from '../components/NavBar/Sidebar';
import UrlDetector from '../components/Panel/Dashboard/UrlDetector';
import ReportDetails from '../components/Panel/Report/ReportDetails';
import UserFaq from '../components/Panel/FAQ/UserFaq';
import AdminFaq from '../components/Panel/FAQ/AdminFaq';
import ManageUser from '../components/Panel/ManageUsers/ManageUser';
import CustomGraph from '../components/Panel/Report/CustomGraph';
import ViewUserQueries from '../components/Panel/FAQ/ViewUserQueries';
import AskQueries from '../components/Panel/FAQ/AskQueries';

const Panel = () => {
    const navigate = useNavigate();
    const [loader, setLoader] = useState<boolean>(true);
    const [role, setRole] = useState<string>("");

    useEffect(() => {
        const auth_token = localStorage.getItem("auth_token");

        if (auth_token && auth_token.trim().length) {
            // set the required data in local storage
            let decodedToken = parseJwt(auth_token);
            let currentDate = new Date();
            let expiryDate = new Date(decodedToken.exp * 1000);
            if (currentDate < expiryDate) {
                setRole(decodedToken.role)
            } else {
                navigate("/token-expired")
            }

        } else {
            navigate("/login")
        }
        setLoader(false)
    }, [])


    function parseJwt(token: string) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    if (loader && role !== "") {
        return <></>
    }

    return (<div className="flex h-screen bg-gray-100">
        <Sidebar role={role} />
        <div className="flex-grow p-6">
            <Routes>
                <Route path='' element={<Suspense fallback={<></>}><Dashboard /></Suspense>} />
                {role === "admin" ?
                    <Route
                        path='dashboard'
                        element={<Suspense fallback={<></>}><Dashboard /></Suspense>}
                    /> : <></>}
                <Route
                    path='url-detector'
                    element={<Suspense fallback={<></>}><UrlDetector /></Suspense>}
                />
                <Route
                    path='learn-more'
                    element={<Suspense fallback={<></>}><ReportDetails /></Suspense>}
                />
                {role === "user" ? <Route
                    path='faq'
                    element={<Suspense fallback={<></>}><UserFaq /></Suspense>}
                /> : <Route
                    path='faq'
                    element={<Suspense fallback={<></>}><AdminFaq /></Suspense>}
                />}

                {role === "admin" ? <Route
                    path='graph'
                    element={<Suspense fallback={<></>}><CustomGraph /></Suspense>}
                /> : <></>}
                {role === "admin" ? <Route
                    path='manage-users'
                    element={<Suspense fallback={<></>}><ManageUser /></Suspense>}
                /> : <></>}


                <Route
                    path='queries'
                    element={<Suspense fallback={<></>}>
                        {role === "admin" ? <ViewUserQueries /> : <AskQueries />}
                    </Suspense>}
                />
                <Route path='section' element={<Suspense fallback={<></>}><SectionOne /></Suspense>} />
                <Route path='/*' element={<Suspense fallback={<></>}><PageNotFound /></Suspense>} />
            </Routes>
        </div>
    </div>
    )
}

export default Panel