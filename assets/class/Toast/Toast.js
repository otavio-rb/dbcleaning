export default class Toast {
  constructor(duration = 1000) {
    this.duration = duration;

    this.toastContainer = document.createElement("div");
    this.toastContainer.className = "toast-container";
    document.body.appendChild(this.toastContainer);
  }

  success(message) {
    const toastElement = document.createElement("div");
    toastElement.onclick = () => this.close(toastElement);
    toastElement.className = "toast success";
    toastElement.innerHTML = `
      <span class="toast-icon">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m382-354 339-339q12-12 28.5-12t28.5 12q12 12 12 28.5T778-636L410-268q-12 12-28 12t-28-12L182-440q-12-12-11.5-28.5T183-497q12-12 28.5-12t28.5 12l142 143Z"/></svg>
      </span>
      <span>${message}</span>
    `;

    this.show(toastElement);
  }

  error(message) {
    const toastElement = document.createElement("div");
    toastElement.onclick = () => this.close(toastElement);
    toastElement.className = "toast error";
    toastElement.innerHTML = `
      <span class="toast-icon">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z"/></svg>
      </span>
      <span>${message}<span>
    `;
    this.show(toastElement);
  }

  warning(message) {
    const toastElement = document.createElement("div");
    toastElement.onclick = () => this.close(toastElement);
    toastElement.className = "toast warning";
    toastElement.innerHTML = `
      <span class="toast-icon">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M109-120q-11 0-20-5.5T75-140q-5-9-5.5-19.5T75-180l370-640q6-10 15.5-15t19.5-5q10 0 19.5 5t15.5 15l370 640q6 10 5.5 20.5T885-140q-5 9-14 14.5t-20 5.5H109Zm69-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm0-120q17 0 28.5-11.5T520-400v-120q0-17-11.5-28.5T480-560q-17 0-28.5 11.5T440-520v120q0 17 11.5 28.5T480-360Zm0-100Z"/></svg>
      </span>
      <span>${message}<span>
    `;
    this.show(toastElement);
  }

  show(toastElement) {
    this.toastContainer.appendChild(toastElement);

    setTimeout(() => {
      toastElement.classList.add("active");
    }, 100);

    setTimeout(() => this.close(toastElement), this.duration);
  }

  close(toastElement) {
    toastElement.classList.remove("active");

    setTimeout(() => {
      this.toastContainer.removeChild(toastElement);
    }, 500);
  }
}