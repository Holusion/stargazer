/**
 * WrapperError is a class that take an error in parameter and create an error readeable for notifier for example
 */
class ErrorWrapper extends Error {
    constructor(name, error) {
        super(error.message);
        const stackDescriptor = Object.getOwnPropertyDescriptor(this, 'stack');
        const getStack = stackDescriptor.get || (() => stackDescriptor.value);

        Object.defineProperty(this, 'stack', {
            get: () => `${getStack.call(this)}\nCaused by: ${error.stack}`
        });

        this.name = name;
    }
}

module.exports = {ErrorWrapper}