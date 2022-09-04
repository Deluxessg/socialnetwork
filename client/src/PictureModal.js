export default function PictureModal({ uploadClose, uploadPicture }) {
    function onSubmit(event) {
        event.preventDefault();

        fetch("/api/users/profile", {
            method: "POST",
            body: new FormData(event.target),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    alert("Error uploading avatar!");
                    return;
                }
                uploadPicture(data.profile_picture_url);
                console.log("data", data);
            });
    }
    return (
        <div className="modal-container">
            <div className="picture-modal">
                <button className="modal-input" onClick={uploadClose}>
                    X
                </button>
                <form onSubmit={onSubmit}>
                    <div className="input-wrap">
                        <input
                            className="modal-input"
                            name="file"
                            type="file"
                            accept="image/*"
                            required
                        ></input>
                        <button className="modal-input">Upload</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
