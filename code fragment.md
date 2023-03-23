#### 1. Project 1

+ Description: This is a code fragment from the backend project I refactored. I inherited this backend project from my colleagues who no longer work on this team. It was a massive challenge to me because our backend code is working as a solution for multiple front-end applications. With the increasing number of customers, concurrency requests are demanding. It makes the backend slower and slower. While refactoring the code, I must keep the same restful APIs because it works for multiple frontend apps.
  Meanwhile, I refactored the coding algorithm and data structure to make them faster and more readable. I also upgraded all libraries we use and significantly upgraded typeORM from 0.2.44 to 0.3.11. Replaced deprecated APIs with the new ones and used master database and slave database to provide a much better user experience. As a result, the speed has been significantly increased and it is running very well and stable.
+ This is the code snippet below：

```typescript
// ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇ OPTIMIZATION START ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇
 const studentsFound: User[] = await gDB.getRepository(User).findBy({id: In(studentIds)})
 if (studentsFound.length !== studentIds.length) {
   CLog.bad('Student not found in create Api enrollment')
   return res.send({rs: false, message: 'there is something wrong, student not found'})
 }


const [{affected: updateCount}, studentEnrolled] = await Promise.all([
  gDB
  .createQueryBuilder()
  .update(ApiEnrollment)
  .set({
    expireDate,
    threshold,
    curThreshold: threshold,
  })
  .where({
    api: {id: api.id},
    student: {id: In(studentsFound.map(s => s.id))}
  })
  .execute(),

  super.repo(ApiEnrollment).find({
    where: {
      api: {id: api.id},
      student: {id: In(studentsFound.map(s => s.id))}
    }
  })
])
const myKeys = []

const ids = studentEnrolled.map(s => {
  myKeys.push(s.myKey)
  return s.student.id
})
const notEnrolled = studentsFound.filter(student => !ids.includes(student.id))
const notEnrolledMyKeys = await Promise.all(notEnrolled.map(student => apiGuard.genKeyInfo(student)))
if (notEnrolledMyKeys.includes('')) {
  CLog.bad('Err in Not Enrolled My keys')
  return res.send({rs: false, message: ErrStr.CreateDataError})
}
await super.repo(ApiEnrollment).insert(notEnrolled.map((student, i) => ({
  api,
  student,
  expireDate,
  threshold,
  curThreshold: threshold,
  myKey: notEnrolledMyKeys[i]
})))
myKeys.push(...notEnrolledMyKeys)

await Promise.all(myKeys.map(myKey => {
  return Promise.all(
    [
      global.redis.hSet(myKey, API_REDIS_HSET_FIELD.CURRENT_THRESHOLD, threshold),
      global.redis.hSet(myKey, API_REDIS_HSET_FIELD.MAX_THRESHOLD, threshold),
      global.redis.hSet(myKey, API_REDIS_HSET_FIELD.EXPIRE_DATE, expireDate),
      global.redis.hSet(myKey, API_REDIS_HSET_FIELD.URL, api.url)
    ]
  )
}))
// ⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆ OPTIMIZATION END ⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆


// ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇ OLD VERSION START ⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇⬇
// let curThreshold = threshold
// const myKey = await apiGuard.genKeyInfo(student)
// await super.repo(ApiEnrollment).create({
//     api,
//     student,
//     expireDate,
//     threshold,
//     curThreshold,
//     myKey,
// }).save()
//
//
// for (const studentId of studentIds) {
//     // get student
//     const student = await super.repo(User).findOneBy({id : +studentId})
//     if (!student) {
//         errors.push(`Student with id ${studentId} not found`)
//         break
//     }
//
//     // get student enrollment
//     const studentEnrolled = await super.repo(ApiEnrollment).findOne({
//         where: {
//             api:{id:apiId},
//             student:{id:+studentId}
//     }})
//     if (studentEnrolled) {
//         // update student enrollment data
//         studentEnrolled.expireDate = expireDate
//         studentEnrolled.threshold = threshold
//         studentEnrolled.curThreshold = threshold
//         const myKey = studentEnrolled.myKey
//         await studentEnrolled.save()
//         if(await global.redis.exists(studentEnrolled.myKey) === 1) {
//             await global.redis.hSet(myKey,API_REDIS_HSET_FIELD.CURRENT_THRESHOLD,threshold)
//             await global.redis.hSet(myKey,API_REDIS_HSET_FIELD.MAX_THRESHOLD,threshold)
//             await global.redis.hSet(myKey,API_REDIS_HSET_FIELD.EXPIRE_DATE,expireDate)
//             await global.redis.hSet(myKey,API_REDIS_HSET_FIELD.URL,api.url)
//         }
//
//         updateCount++
//     } else {
//         // create new enrollment
//         let curThreshold = threshold
//         const myKey = await apiGuard.genKeyInfo(student)
//         await super.repo(ApiEnrollment).create({
//             api,
//             student,
//             expireDate,
//             threshold,
//             curThreshold,
//             myKey,
//         }).save()
//         // const strThreshold = threshold.toString()
//         await global.redis.hSet(myKey,API_REDIS_HSET_FIELD.CURRENT_THRESHOLD,threshold)
//         await global.redis.hSet(myKey,API_REDIS_HSET_FIELD.MAX_THRESHOLD,threshold)
//         await global.redis.hSet(myKey,API_REDIS_HSET_FIELD.EXPIRE_DATE,expireDate)
//         await global.redis.hSet(myKey,API_REDIS_HSET_FIELD.URL,api.url)
//         createCount++
//     }
// }
// ⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆ OLD VERSION END ⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆⬆
```





#### 2. Project 2

+ Description: This exciting project can switch convert text to speech based on different pitches, speaking speeds, languages, gender, etc. Previously, we had to invite specialists to make records for the documents in my company. It costs much money. However, we don't have to because we can use google's text-to-speech service to do this. So I am responsible for developing this feature for my company. It can generate audio based on different pitches, speeds, and accents specified. Furthermore, the audio can be downloaded automatically. It works very well now, and we no longer have to spend money inviting others to make records.
+ This is the code snippet below：

```typescript
static playAudio = async (req: Request, res: Response) => {
  try {
    const {pitch, speakingRate, languageCode, gender} = req.query
    const randomSpeed = Math.floor(Math.random() * 2)
    const randomPitch = Math.floor(Math.random() * 10)

    await authenticateImplicitWithAdc()

    const client = new textToSpeech.TextToSpeechClient()

    const index = Math.floor(Math.random() * textList.length)
    const text = textList[index]
    const outputFile = `${Date.now()}.mp3`;

    const request: ISynthesizeSpeechRequest = {
      audioConfig: {
        pitch: randomPitch,
        speakingRate: randomSpeed,
        audioEncoding: 'MP3'
      },
      input: {
        text: text
      },
      voice: {
        languageCode: accentList[Math.floor(Math.random() * accentList.length)],
        ssmlGender: genderList[Math.floor(Math.random() * genderList.length)]
      },
    };
    const [response] = await client.synthesizeSpeech(request)
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(`./src/audio/${outputFile}`, response.audioContent || '', 'binary');
    console.log(`Audio content written to file: ${outputFile}`);
    return res.status(200).send({
      text,
      mp3: `${outputFile}`
    })
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      message: e.message
    })
  }

}
```

