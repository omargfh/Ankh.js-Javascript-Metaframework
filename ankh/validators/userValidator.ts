import validator from 'validator';
const validators = (query: any) => {
    return {
        name: validator.isLength(query.name ?? "", { min: 3, max: 50 }),
        email: validator.isEmail(query.email ?? "", {min: 1}),
        password: validator.isLength(query.password ?? "", { min: 8, max: 50 }),
        role: validator.isIn(query.role ?? "", ['admin', 'user'], { ignoreCase: true })
    }
}
export default validators;