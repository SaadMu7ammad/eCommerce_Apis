const asyncHandler = (fn) => (req, res, next) => {
    // console.log('async 1');
    Promise.resolve(fn(req, res, next)).catch(next);
    // console.log('async 2');
};

export default asyncHandler