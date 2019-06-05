 function ResourceAlreadyPresentError(message) {
     this.message = message;
     this.name = "ResourceAlreadyPresentError";
     Error.captureStackTrace(this, ResourceAlreadyPresentError);
 }
 ResourceAlreadyPresentError.prototype = Object.create(Error.prototype);
 ResourceAlreadyPresentError.prototype.constructor = ResourceAlreadyPresentError;

 function ResourceNotFoundError(message) {
     this.message = message;
     this.name = "ResourceNotFoundError";
     Error.captureStackTrace(this, ResourceNotFoundError);
 }
 ResourceNotFoundError.prototype = Object.create(Error.prototype);
 ResourceNotFoundError.prototype.constructor = ResourceAlreadyPresentError;


 function ResourceCreationError(message) {
     this.message = message;
     this.name = "ResourceCreationError";
     Error.captureStackTrace(this, ResourceCreationError);
 }
 ResourceCreationError.prototype = Object.create(Error.prototype);
 ResourceCreationError.prototype.constructor = ResourceAlreadyPresentError;

 function ResourceDeletionError(message) {
    this.message = message;
    this.name = "ResourceDeletionError";
    Error.captureStackTrace(this, ResourceDeletionError);
}
ResourceDeletionError.prototype = Object.create(Error.prototype);
ResourceDeletionError.prototype.constructor = ResourceDeletionError;




 module.exports = {
     ResourceAlreadyPresentError: ResourceAlreadyPresentError,
     ResourceCreationError: ResourceCreationError,
     ResourceNotFoundError: ResourceNotFoundError,
     ResourceDeletionError: ResourceDeletionError
 }