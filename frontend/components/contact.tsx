export default function ContactSection() {

  const contacts = [

    {
      name: "Rencho",
      email: "me@therencho.com",
      linkedin: "https://www.linkedin.com/in/therencho/",
    },

    {
      name: "Shaaref",
      email: "minhas.khushhal1@gmail.com",
      linkedin: "https://www.linkedin.com/in/shaaref-khushhal-minhas-aba875216/",
    },

    {
      name: "Umut",
      email: "umut@example.com",
      linkedin: "https://linkedin.com",
    },
  ];

  return (

    <section
    id="contact"
      className="
        w-full
        max-w-7xl
        mx-auto
        px-6
        py-24
      "
    >

      {/* Heading */}

      <div
        className="
          mb-12
          text-center
        "
      >

        <h2
          className="
            text-4xl
            md:text-5xl
            font-bold
            tracking-tight
            text-white
          "
        >

          Contact

        </h2>

        <p
          className="
            text-gray-500
            mt-4
            text-lg
          "
        >

          Connect with the developers
          behind Rus.

        </p>

      </div>

      {/* Cards */}

      <div
        className="
          grid
          md:grid-cols-3
          gap-6
        "
      >

        {contacts.map(
          (person, idx) => (

            <div

              key={idx}

              className="
                rounded-[28px]
                border
                border-white/10
                bg-[#141821]
                p-8
                transition-all
                duration-300
                hover:bg-[#181d28]
              "
            >

              {/* Name */}

              <h3
                className="
                  text-2xl
                  font-semibold
                  text-white
                  tracking-tight
                "
              >

                {person.name}

              </h3>

              {/* Email */}

              <div
                className="
                  mt-6
                "
              >

                <p
                  className="
                    text-xs
                    uppercase
                    tracking-wider
                    text-gray-600
                    mb-2
                  "
                >

                  Email

                </p>

                <a
                  href={`mailto:${person.email}`}
                  className="
                    text-gray-300
                    hover:text-white
                    transition-colors
                    duration-200
                    break-all
                  "
                >

                  {person.email}

                </a>

              </div>

              {/* LinkedIn */}

              <div
                className="
                  mt-6
                "
              >

                <p
                  className="
                    text-xs
                    uppercase
                    tracking-wider
                    text-gray-600
                    mb-2
                  "
                >

                  LinkedIn

                </p>

                <a
                  href={person.linkedin}
                  target="_blank"
                  className="
                    text-gray-300
                    hover:text-white
                    transition-colors
                    duration-200
                  "
                >

                  View Profile

                </a>

              </div>

            </div>
          )
        )}

      </div>

    </section>
  );
}