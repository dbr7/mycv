require "digest"

module Jekyll
  # Recompute from the actual PDF on every build; no manually maintained version.
  class CvVersion < Generator
    safe true
    priority :highest

    def generate(site)
      pdf = File.join(site.source, "assets", "files", "Jinhan_s_cv.pdf")
      unless File.file?(pdf)
        raise Errors::FatalException, "CV PDF not found: #{pdf}"
      end

      site.config["cv_sha256"] = Digest::SHA256.file(pdf).hexdigest
    end
  end
end
