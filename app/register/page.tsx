"use client"
import DoctorRegister from '@/components/Doctor_register';
import PatientRegister from '@/components/Patient_register';
import { Divider, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { Card } from "antd";
import Link from 'next/link';

const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Doctor',
        children: <DoctorRegister />,
    },
    {
        key: '2',
        label: 'Patient',
        children: <PatientRegister/>,
    },

];
export default function Register() {

    return (
        <div className="w-11/12 mx-auto min-h-screen flex justify-center items-center my-auto ">

            <Card className='min-w-[300px] sm:min-w-md   h-200 '>
                <Tabs centered items={items} className='overflow-y-auto h-full'/>
                          <div className="text-center mt-4 flex flex-col">
            <Link href="/login">Have an account? Sign In</Link>
            or
            <Divider/>

            <Link href="/">Back To Home</Link>
          </div>
            </Card>
            
        </div>
    );
}
