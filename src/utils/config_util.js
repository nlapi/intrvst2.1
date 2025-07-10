// const def_prompt = `The following is a transcript of an interview dialogue. Please extract the last question asked by the interviewer and provide an answer. If it is an algorithm question, please provide the approach and code implementation. If no question is found, there is no need to respond.`


function gpt_system_prompt() {
    return localStorage.getItem("gpt_system_prompt") || "Generate helpful talking points and answers based on my resume, job requirements, and job description to the best of your abilities. Provide specific examples from my background that align with the role requirements and help me articulate my qualifications effectively during the interview."
}

function azure_language() {
    return localStorage.getItem("azure_language") || "en-US"
}

function azure_region() {
    return localStorage.getItem("azure_region") || "eastasia"
}

function gpt_model() {
    return localStorage.getItem("gpt_model") || "gpt-4o"
}

export default {
    gpt_system_prompt,
    azure_language,
    azure_region,
    gpt_model
}