import StudentsPicker from '../components/StudentsPicker';
import StudentsTable from '../components/StudentsTable';
import { fetchStudentData, fetchSchoolData, fetchLegalguardianData } from '../utils';
import { useState } from 'react';


const studentsDataComponent = () => {
    const [studentsData, setStudentsData] = useState([]);
    const [schoolsData, setSchoolsData] = useState([]);
    const [legalguardiansData, setLegalguardiansData] = useState([]);


    const onStudentsPick = async (studentIds) => {
        //finding studentId which don't exist in studentsData array
        const newStudentIds = studentsData.filter(function(obj) { return studentIds.indexOf(obj?.studentId) == -1; });
        for (const studentId of newStudentIds) {
            const studentData = await fetchStudentData(studentId);
            if (studentData) {
                setStudentsData([...studentsData, studentData]);
                for (const student of studentData) {
                    const { schoolId, legalguardianId } = student;
                    //call both apis parallely so it will save time.
                    Promise.all(
                        [
                            fetchSchoolData(schoolId),
                            fetchLegalGuardianData(legalguardianId)
                        ]
                    ).then(function (data) {
                     //assigning data to array. 
                        if(data){
                        setSchoolsData([...schoolsData, data?.schoolData]);
                        setLegalguardiansData([...legalguardiansData, data?.legalguardianData]);
                    }}).catch(function (error) {
                        // if there's an error, log it
                        console.log(error);
                    });
                }
            }
        }
    };


    return (
        <>
            <StudentsPicker onPickHandler={onStudentsPick} />
            <StudentsTable
                studentsData={studentsData}
                schoolsData={schoolsData}
                LegalguardiansData={legalguardiansData}
            />
        </>
    );
};


export default studentsDataComponent;


