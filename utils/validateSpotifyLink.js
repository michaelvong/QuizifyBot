const validateLink = async (user_input) => {
    console.log(user_input);
    const url_pattern = new RegExp('^https:\/\/open\.spotify\.com\/playlist\/([0-9A-Za-z]+)\?.*');
    return url_pattern.test(user_input);
}

module.exports = { validateLink };