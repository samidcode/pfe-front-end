import swal from 'sweetalert2';

// Simple Alert
export function basicAlert() {
    swal.fire("Here's a message!");
}

// Alert with Title
export function withTitle() {
    swal.fire("Here's a message!", "It's pretty, isn't it?");
}

//  HTML Alert
export function htmlAlert() {
    swal.fire({
        title: 'HTML <small>Title</small>!',
        html: 'A custom <span style="color:#F6BB42">html<span> message.'
    });
}

// Question Type Alert
export function typeQuestion() {
    swal.fire("Question", "Are You Sure?", "question");
}

// Success Type Alert
export function typeSuccess() {
    swal.fire("Good job!", "You clicked the button!", "success");
}

// Info Type Alert
export function typeInfo() {
    swal.fire("Info!", "You clicked the button!", "info");
}

// Warning Type Alert
export function typeWarning() {
    swal.fire("Warning!", "Password incorrect!", "warning");
}

// Error Type Alert
export function typeError() {
    swal.fire("Error!", "You clicked the button!", "error");
}

// Custom Icon
export function customIcon() {
    swal.fire({ title: "Sweet!", text: "Here's a custom image.", imageUrl: "./assets/img/portrait/avatars/avatar-08.png" });
}

// Auto close timer
export function autoClose() {
    swal.fire({ title: "Auto close alert!", text: "I will close in 2 seconds.", timer: 2000, showConfirmButton: false });
}

// Allow Outside Click
export function outsideClick() {
    swal.fire({
        title: 'Click outside to close!',
        text: 'This is a cool message!',
        allowOutsideClick: true
    });
}

// Confirm Button Action
export function confirmText() {
    return new Promise(async (resolve) => {
      const result = await swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });
  
      if (result.isConfirmed) {
        swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        );
      } 
  
      resolve(result);
    });
  }
  
  

