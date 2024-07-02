import * as Yup from 'yup'

export const loginValidation = Yup.object({
    email: Yup.string().email("please enter valid email").required("please enter email"),
    password: Yup.string().min(8, "password must be at least 8 characters").required("please enter password"),
    // organization_id: Yup.number().required("please enter organization id")
})