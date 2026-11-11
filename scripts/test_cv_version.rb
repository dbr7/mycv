require "jekyll"
require "tmpdir"
require "fileutils"
require_relative "../_plugins/cv_version"

Dir.mktmpdir do |source|
  pdf = File.join(source, "assets", "files", "Jinhan_s_cv.pdf")
  FileUtils.mkdir_p(File.dirname(pdf))
  site = Struct.new(:source, :config).new(source, {})
  generator = Jekyll::CvVersion.new

  File.binwrite(pdf, "fixture CV one")
  generator.generate(site)
  first = site.config.fetch("cv_sha256")
  abort "Incorrect digest" unless first == Digest::SHA256.file(pdf).hexdigest
  generator.generate(site)
  abort "Unchanged PDF got a new version" unless site.config["cv_sha256"] == first

  File.binwrite(pdf, "fixture CV two")
  generator.generate(site)
  abort "Changed PDF kept the old version" if site.config["cv_sha256"] == first
  abort "Incorrect updated digest" unless site.config["cv_sha256"] == Digest::SHA256.file(pdf).hexdigest

  File.delete(pdf)
  begin
    generator.generate(site)
    abort "Missing PDF did not stop the build"
  rescue Jekyll::Errors::FatalException
    # Expected: never emit an unversioned or stale CV link when the PDF is absent.
  end
end

puts "PASS: CV versions are content-based, stable, auto-updated, and fail closed"
